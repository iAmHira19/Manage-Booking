export function configure(sessionId) {
  // let sessionId = sessionStorage.getItem("sessionId");
  Checkout.configure({
    session: {
      id: sessionId,
    },
  });
  Checkout.showEmbeddedPage("#embed-target");
}

export function errorCallback(error) {
  console.log(JSON.stringify(error));
}

export function cancelCallback() {
  console.log("Payment cancelled");
}
