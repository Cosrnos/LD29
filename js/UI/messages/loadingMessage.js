var loadingMessage = new Message("Now Loading...", "<p>We're getting everything set up! This should only take a few minutes...<p>", function () {
	window.open("http://lynxjs.com/");
});

loadingMessage.AcceptButton.Text = "Check out the engine we used to make this!";