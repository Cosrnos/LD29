/*
 *    Lynx Project
 *    Started August 2013
 *    ------------------------------------------------------
 *    This file is covered under the LynxJS Game Library
 *    License. Please read license.txt for more information
 *    on usage of this library.
 *    ------------------------------------------------------
 *    File Name: Renderer.js
 *    Description: The Renderer is attached to a canvas element, and provides respective methods for webgl and 2d context
 *    Global Variables: Lynx.Animator{}
 */

Lynx.Renderer = function (pCanvas) {
	var that = {};

	//Properties
	that.BatchSize = 1500;

	if (!Lynx.Canvas) {
		return that;
	}

	that.Parent = pCanvas;
	var context = pCanvas.Ctx(Lynx.DefaultContext);

	/**
	 * Description: Builds the rendering context and associated values
	 *
	 * @this {Lynx.Renderer}
	 */
	that.RefreshContext = function () {
		context = that.Parent.Ctx(Lynx.DefaultContext);

		that.__refreshGL();
	};

	if (Lynx.DefaultContext == "2d") {
		var buffer = null,
			ctx = null;

		var lastFillColor = 0;
		/**
		 * Description: Clears the 2d Canvas
		 *
		 * @this {Lynx.Renderer}
		 */
		that.Clear = function () {
			ctx.clearRect(0, 0, buffer.width, buffer.height);
			context.fillStyle = "#" + this.Parent.ClearColor.Hex.toString("16");
			context.fillRect(0, 0, this.Parent.Width, this.Parent.Height);
		};

		/**
		 * Description: Renders the 2D Scene using the fallback canvas 2d context
		 *
		 * @this {Lynx.Renderer}
		 * @param {Lynx.CanvasElement[]} <pObject> the object(s) to render
		 */
		that.Render = function (pObject, pCamera) {
			if (!(pObject instanceof Array)) {
				pObject = [pObject];
			}

			if (!pCamera) {
				pCamera = {
					X: 0,
					Y: 0
				};
			}
			var lastAlpha = 1;

			for (var i = 0; i < pObject.length; i++) {
				if (pObject[i].FBRender) {
					pObject[i].FBRender(ctx, pCamera);
					continue;
				}

				if (lastFillColor != pObject[i].Color) {
					if (pObject[i].Color.Hex != -1) {
						var newColor = "#" + pObject[i].Color.Hex.toString(16);
						ctx.fillStyle = newColor;
					}

					lastFillColor = pObject[i].Color;
				}

				if (lastAlpha != pObject[i].Alpha) {
					ctx.globalAlpha = pObject[i].Alpha;

					lastAlpha = pObject[i].Alpha;
				}

				pObject[i].Draw(ctx, pCamera);
			}
			context.drawImage(buffer, 0, 0, buffer.width, buffer.height);
		};

		/**
		 * Description: Refreshes the internal context variables
		 *
		 * @this {Lynx.Renderer}
		 */
		that.__refreshGL = function () {
			buffer = document.createElement("canvas");
			buffer.width = this.Parent.Width;
			buffer.height = this.Parent.Height;
			ctx = buffer.getContext("2d");
		};

	} else {
		var gl = context;
		var program = null,
			vertexShader = null,
			fragmentShader = null;
		var lastShaderColor = null;
		var hasContext = false;
		var blankTexture = null;
		var textures = [];
		var texCoordBuffer = null,
			positionBuffer = null;

		var ready = false;

		/**
		 * A webgl rendering texture object
		 *
		 * @this {Lynx.Renderer.Texture}
		 */
		var Texture = function (pImage, pTexture) {
			this.Image = pImage;
			this.Texture = pTexture
		};

		/**
		 * Description: Refreshes the WebGL program and shaders.
		 *
		 * @this {Lynx.Renderer}
		 */
		that.__refreshGL = function () {
			gl = context;
			gl.viewport(0, 0, that.Parent.Width, that.Parent.Height);

			var cc = that.Parent.ClearColor;
			gl.clearColor(cc.R, cc.G, cc.B, 1.0);

			//Clear current programs and shaders.
			that.LoadShader("vs-default", function (pName) {
				that.LoadShader("fs-default", function (pSecName) {
					program = that.CompileProgram(that.CompileShader(pName), that.CompileShader(pSecName));

					if (!program) {
						Lynx.Error("Failed to compile WebGL Program.");
						return false;
					}

					gl.useProgram(program);

					vertexShader = Lynx.Shaders.Get(pName);
					fragmentShader = Lynx.Shaders.Get(pSecName);

					vertexShader.GetLocations(gl, program);
					fragmentShader.GetLocations(gl, program);

					var texCoordLocation = vertexShader.GetVariable("texCoord", "attribute");

					texCoordBuffer = gl.createBuffer();
					gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
					gl.enableVertexAttribArray(texCoordLocation);
					gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 0, 0);

					blankTexture = gl.createTexture();
					gl.bindTexture(gl.TEXTURE_2D, blankTexture);

					gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
					gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
					gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
					gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

					gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([255, 255, 255, 255]));

					gl.uniform2f(vertexShader.GetVariable("resolution", "uniform").Location, this.Parent.Width, this.Parent.Height);

					positionBuffer = gl.createBuffer();
					gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
					gl.enableVertexAttribArray(vertexShader.GetVariable("position", "attribute").Location);
					gl.vertexAttribPointer(vertexShader.GetVariable("position", "attribute").Location, 2, gl.FLOAT, false, 0, 0);

					gl.enable(gl.BLEND);
					gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

					Lynx.Log("Finished loading shaders...");
				});
			});

			if (!ready) {
				that.Parent.Element.addEventListener("webglcontextlost", function (event) {
					event.preventDefault();
					hasContext = false;
					Lynx.Emit("Renderer.ContextLost");
				}, false);

				that.Parent.Element.addEventListener("webglcontextrestored", that.__refreshGL, false);

				ready = true;
			}

			hasContext = true;
		};

		/**
		 * Description: Clears the WebGL Buffers
		 *
		 * @this {Lynx.Renderer}
		 */
		that.Clear = function () {
			gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		};

		/**
		 * Description: Loads a dynamic webGL Shader then executes the provided callback
		 *
		 * @this {Lynx.Renderer}
		 * @param {string} <pName> Name of the dynamic shader to load
		 * @param {function<pShader>} A function to call when the shader is finished loading.
		 */
		that.LoadShader = function (pName, pLoadCallback) {
			if (document.getElementById("lynx-shader-" + pName) !== null) {
				return;
			}

			var script = document.createElement("script");
			script.id = "lynx-shader-" + pName;
			script.type = "text/javascript";
			script.async = true;

			script.addEventListener("load", function () {
				if (Lynx.Debug) {
					Lynx.Log("Loaded shader '" + pName + "'");
				}

				pLoadCallback.bind(that)(pName);
			}, false);
			var end = pName + ".js";
			if (Lynx.DisableCache) {
				end = end + "?a=" + Date.now();
			}
			script.src = Lynx.Filepath + "shaders/" + end;
			document.body.appendChild(script);
		};

		/**
		 * Description: Compiles the given shader
		 *
		 * @this {Lynx.Renderer}
		 * @param {string} <pName> The name of the shader to compile
		 * @return {WebGLShader} A compiled shader
		 */
		that.CompileShader = function (pName) {
			var shaderC = Lynx.Shaders.Get(pName);
			if (!shaderC) {
				return false;
			}

			var shader = gl.createShader(((shaderC.Type === Lynx.Shaders.Type.Vertex) ? gl.VERTEX_SHADER : gl.FRAGMENT_SHADER));
			gl.shaderSource(shader, shaderC.Compile());
			gl.compileShader(shader);

			var compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
			if (!compiled) {
				var lastError = gl.getShaderInfoLog(shader);
				Lynx.Error("Error compiling shader '" + pName + "': " + lastError);
				gl.deleteShader(shader);
				return false;
			}

			return shader;
		};

		/**
		 * Description: Compiles a program with all compiled shaders.
		 *
		 * @this {Lynx.Renderer}
		 * @return {WebGLProgram} The compiled program
		 */
		that.CompileProgram = function () {
			if (arguments.length < 2) {
				Lynx.Warning("Could not compile WebGL Program. At least one Vertex Shader and one Fragment Shader must be provided.");
				return;
			}

			var tempProgram = gl.createProgram();

			for (var ii = 0; ii < arguments.length; ii++) {
				gl.attachShader(tempProgram, arguments[ii]);
			}

			gl.linkProgram(tempProgram);
			if (!gl.getProgramParameter(tempProgram, gl.LINK_STATUS)) {
				return false;
			}

			return tempProgram;
		};

		/**
		 * Description: Renders the WebGL Scene
		 *
		 * @this {Lynx.Renderer}
		 * @param {Lynx.CanvasElement} <pObject> The object(s) to render to the canvas.
		 */
		that.Render = (function (pObjects, pCamera) {
			if (!vertexShader || !fragmentShader || !hasContext) {
				return false;
			}

			var buildArray = [];

			if (!(pObjects instanceof Array)) {
				pObjects = [pObjects];
			}

			var lastLayer = 0;
			var lastTexture = null;
			var lastAlpha = 1.0;

			for (var i = 0; i < pObjects.length; i++) {
				var o = pObjects[i];

				if (o.Render) {
					o.Render(gl, pCamera);
					continue;
				}

				if (o.Layer != lastLayer || this.BatchSize <= buildArray.length / 2) {
					renderBatch(buildArray);
					buildArray = [];
				}

				if (o.Color.Hex == -1 && o.Texture !== false) {
					if (lastTexture == null || lastTexture.Image.src != o.Texture.src) {
						renderBatch(buildArray);
						buildArray = [];

						if (typeof textures[o.Texture.src] === 'undefined') {
							var tempText = gl.createTexture();
							gl.bindTexture(gl.TEXTURE_2D, tempText);

							gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
							gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
							gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
							gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
							gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);

							gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, o.Texture);

							textures[o.Texture.src] = new Texture(o.Texture, tempText);
						}
						var tex = textures[o.Texture.src];

						var texCoordLocation = vertexShader.GetVariable("texCoord", "attribute").Location;
						gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
						gl.enableVertexAttribArray(texCoordLocation);
						gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 0, 0);
						gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
							0.0, 0.0,
							0.0, 1.0,
							1.0, 1.0,
							1.0, 1.0,
							1.0, 0.0,
							0.0, 0.0
						]), gl.STATIC_DRAW);
						gl.bindTexture(gl.TEXTURE_2D, tex.Texture);

						lastTexture = tex;

						gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
						gl.vertexAttribPointer(vertexShader.GetVariable("position", "attribute").Location, 2, gl.FLOAT, false, 0, 0);
					}
				}

				if (o.Color.Hex != lastShaderColor || o.Alpha != lastAlpha) {
					renderBatch(buildArray);
					buildArray = [];

					if (o.Color.Hex != -1) {
						var c = o.Color;
						gl.uniform4f(fragmentShader.GetVariable("color", "uniform").Location, c.R, c.G, c.B, o.Alpha);
						if (lastShaderColor == -1) {
							gl.bindTexture(gl.TEXTURE_2D, blankTexture);
							gl.disableVertexAttribArray(vertexShader.GetVariable("texCoord", "attribute").Location);
						}
					} else {
						gl.uniform4f(fragmentShader.GetVariable("color", "uniform").Location, 1.0, 1.0, 1.0, 1.0);
					}

					lastShaderColor = o.Color.Hex;
				}

				o.GetVertices(buildArray, pCamera);
			}

			renderBatch(buildArray);
		}).bind(that);

		/**
		 * Description: Renders the given array to the canvas
		 *
		 * @this {Lynx.Renderer}
		 * @param {array} <pBuildArray> An array containing the vertices to render
		 */
		function renderBatch(pBuildArray) {
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pBuildArray), gl.STATIC_DRAW);
			gl.drawArrays(gl.TRIANGLES, 0, pBuildArray.length / 2);
		}
	}

	return that;
};
