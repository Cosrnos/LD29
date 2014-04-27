var Menu = function (pName, pClose) {
	this.Target = null;
	this.Disposed = true;
	this.Name = pName;
	this.X = 0;
	this.Y = 0;

	pClose = pClose || true;

	var options = [];

	var element = document.createElement("div");
	element.id = "ui-" + pName;
	element.style.position = "absolute";
	element.style.zIndex = 9;
	element.style.position.top = 0;
	element.style.position.left = 0;
	element.style.background = "#c7b299";
	element.style.padding = "10px 10px";
	element.style.width = "300px";
	element.style.border = "3px solid #362f2d";
	element.style.borderRadius = "5px";

	element.style.visibility = "hidden";
	var Option = function (pName, pClickCallback, pParent) {
		var that = {};
		that.Parent = pParent;

		that.Element = document.createElement("button");
		that.Element.innerHTML = pName;
		that.Element.style.background = "#362f2d";
		that.Element.style.border = "1px solid #000000";
		that.Element.style.borderRadius = "5px";

		that.Element.style.width = "100%";
		that.Element.style.display = "block";
		that.Element.style.color = "#ffffff";
		that.Element.style.fontSize = "18px";
		that.Element.style.outline = "0px";
		that.Element.style.cursor = "pointer";

		that.Element.onmouseover = function () {
			that.Element.style.background = "#534741";
		};

		that.Element.onmouseout = function () {
			that.Element.style.background = "#362f2d";
		};

		that.Element.onclick = function (e) {
			if (pClickCallback.call(pParent.Target))
				pParent.Hide();

			e.preventDefault();
		};

		return that;
	};

	this.AddOption = (function (pName, pClickCallback) {
		var o = new Option(pName, pClickCallback, this);
		options.push(o);
		return o;
	}).bind(this);

	this.RemoveOption = function (pO) {
		if (options.indexOf(pO) > -1) {
			options.splice(options.indexOf(pO), 1);
		}
	};

	this.MoveBy = function (pX, pY) {
		if (pX === 0 && pY === 0)
			return;

		this.X -= pX;
		this.Y -= pY;

		element.style.top = this.Y + "px";
		element.style.left = this.X + "px";
	}

	this.ShowAt = function (pX, pY) {
		this.X = pX;
		this.Y = pY;
		//Rebuild
		element.innerHTML = "";
		var menuHead = document.createElement("h3");
		menuHead.style.fontSize = "22px";
		menuHead.style.color = "#333333";
		menuHead.style.margin = "0px";
		menuHead.style.padding = "0px 0px 10px 10px";
		menuHead.style.textDecoration = "underline";
		menuHead.innerHTML = this.Name;
		element.appendChild(menuHead);

		for (var i = 0; i < options.length; i++) {
			element.appendChild(options[i].Element);
		}
		if (pClose) {
			element.appendChild(new Option("Close", function () {
				return true;
			}, this).Element);
		}
		element.style.left = this.X + "px";
		element.style.top = this.Y + "px";
		element.style.visibility = "visible";
		this.Disposed = false;
		Game.ActiveMenu = this;
	};

	this.Hide = function () {
		element.style.visibility = "hidden";
		this.Disposed = true;
	};

	document.body.appendChild(element);
}
