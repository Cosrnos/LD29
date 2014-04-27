var Menu = function (pName, pClose) {
	this.Target = null;
	this.Disposed = true;

	pClose = pClose || true;

	var options = [];

	var element = document.createElement("div");
	element.id = "ui-" + pName;
	element.style.position = "absolute";
	element.style.zIndex = 1;
	element.style.position.top = 0;
	element.style.position.left = 0;
	element.style.background = "#efefef";
	element.style.padding = "10px 10px";
	element.style.width = "300px";

	element.style.visibility = "hidden";
	var Option = function (pName, pClickCallback, pParent) {
		var that = {};
		that.Parent = pParent;

		that.Element = document.createElement("button");
		that.Element.innerHTML = pName;

		that.Element.style.width = "100%";
		that.Element.style.display = "block";

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

	this.ShowAt = function (pX, pY) {
		//Rebuild
		element.innerHTML = "";
		var menuHead = document.createElement("h3");
		menuHead.innerHTML = pName;
		element.appendChild(menuHead);

		for (var i = 0; i < options.length; i++) {
			element.appendChild(options[i].Element);
		}
		if (pClose) {
			element.appendChild(new Option("Close", function () {
				return true;
			}, this).Element);
		}
		element.style.left = pX + "px";
		element.style.top = pY + "px";
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