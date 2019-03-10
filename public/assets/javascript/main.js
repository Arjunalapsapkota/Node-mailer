$(document).ready(function() {
  $("#submit_button").click(event => {
    event.preventDefault();

    // fill the form first - All fields Required

    const name = $("#contact-name").val();
    const email = $("#contact-email").val();
    console.log("email: ", email);
    const subject = $("#contact-subject").val();
    const message = $("#contact-message").val();

    //rEGeX
    let res = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);

    console.log(res);
    if (name === "" || subject === "" || message === "") res = false;
    if (res) {
      $.post(
        "/contact",
        {
          name: name,
          email: email,
          subject: subject,
          message: message
        },
        (data, status) => {
          if (status === "success") {
            $("#contact-name").val("");
            $("#contact-email").val("");
            $("#contact-subject").val("");
            $("#contact-message").val("");
          }
          swal("Sent !", "Your Message has been Successfully Sent", "success");
        }
      );
    } else {
      swal(
        "All fields are required!! \nPlease verify the information on the form"
      );
    }
  });
});
