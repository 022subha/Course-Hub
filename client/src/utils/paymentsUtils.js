import axios from "axios";
import Cookies from "js-cookie";

const makePayment = async (amount, user, title) => {
  try {
    const response1 = await axios.get(
      `http://localhost:5000/api/payment/get-key`,
      { headers: { Authorization: "Bearer " + Cookies.get("token") } }
    );
    const response2 = await axios.post(
      `http://localhost:5000/api/payment/buy-subscription`,
      {
        amount,
        plan: title,
      },
      { headers: { Authorization: "Bearer " + Cookies.get("token") } }
    );

    const { key } = response1.data;
    const { subscriptionId } = response2.data;

    const option = {
      key,
      amount,
      name: "Course Hub",
      description: "Get access to premium courses.",
      image: "/assets/images/favicon.png",
      subscription_id: subscriptionId,
      prefill: {
        name: user.name,
        email: user.email,
        contact: "9865541789",
      },
      notes: {
        address: "Botanical Garden Area, Howrah, West Bengal 711103",
      },
      theme: { color: "#e70b53" },
      handler: async (response) => {
        try {
          const verificationResponse = await axios.post(
            `http://localhost:5000/api/payment/payment-verification`,
            {
              response,
            },
            { headers: { Authorization: "Bearer " + Cookies.get("token") } }
          );

          const { success, reference } = verificationResponse.data;
          if (success) {
            window.location.href = `/payment-success?reference=${reference}`;
          } else {
            window.location.href = "/payment-fail";
          }
        } catch (error) {
          console.log(error);
        }
      },
    };
    const razor = window.Razorpay(option);
    razor.open();
  } catch (error) {
    console.log(error);
  }
};

export default makePayment;
