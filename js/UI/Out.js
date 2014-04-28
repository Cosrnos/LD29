var UI = UI || {};

UI.Out = new(function() {
	var that = {};
	var lvlOut = document.getElementById("stat-level-out");
	var expOut = document.getElementById("stat-exp-out");
	var liraOut = document.getElementById("stat-lira-out");
	var domaOut = document.getElementById("stat-doma-out");

	Object.defineProperty(that, "Level", {
		set: function(pValue) {
			lvlOut.innerHTML = pValue;
		}
	});

	Object.defineProperty(that, "Experience", {
		set: function(pValue) {
			expOut.innerHTML = pValue;
		}
	});

	Object.defineProperty(that, "ExperienceBar", {
		set: function(pValue) {
			document.getElementById("stat-expbar-out").style.width = pValue + "%";
		}
	});

	Object.defineProperty(that, "Lira", {
		set: function(pValue) {
			liraOut.innerHTML = pValue;
		}
	});

	Object.defineProperty(that, "Doma", {
		set: function(pValue) {
			domaOut.innerHTML = pValue;
		}
	});


	that.UpdateExpbar = function(pCurrent, pTotal) {
		var progress = Math.floor((pCurrent / pTotal) * 100);
		that.Experience = pCurrent;
		that.ExperienceBar = progress;
	};
	return that;
})();