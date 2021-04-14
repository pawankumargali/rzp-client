import './App.css';
import axios from 'axios';
import logo from './logo.svg';
function App() {

  const _loadScript = src => {
    return new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = src;
        script.onload = () => {
            resolve(true);
        };
        script.onerror = () => {
            resolve(false);
        };
        document.body.appendChild(script);
    });
  }

  const displayRazorpay = async () => {
    const res = await _loadScript("https://checkout.razorpay.com/v1/checkout.js");

    if (!res) {
        alert("Razorpay SDK failed to load. Are you online?");
        return;
    }

    // creating a new order
    const result = await axios.post("http://localhost:5000/payment", { amount: 1, receipt: 'receipt_4404'});

    if (!result) {
        alert("Server error. Are you online?");
        return;
    }

    console.log(result);

    // Getting the order details back
    const { amount, id: order_id, currency, key } = result.data;

    const options = {
        key: key, // Enter the Key ID generated from the Dashboard
        amount: amount.toString(),
        currency: currency,
        name: "Soumya Corp.",
        description: "Test Transaction",
        image: { logo },
        order_id: order_id,
        handler: async function (response) {
            const data = {
                orderCreationId: order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpayOrderId: response.razorpay_order_id,
                razorpaySignature: response.razorpay_signature,
            };

            const result = await axios.post("http://localhost:5000/success", data);

            alert(result.data.msg);
        },
        prefill: {
            name: "Soumya Dey",
            email: "SoumyaDey@example.com",
            contact: "9999999999",
        },
        notes: {
            address: "Soumya Dey Corporate Office",
        },
        theme: {
            color: "#61dafb",
        },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
}

  return (
    <div className="App">
        <header className="App-header">
            <p>Request Session on Full Stack Development</p>
            <button className="App-link" onClick={displayRazorpay}>
                Pay And Confirm
            </button>
        </header>
    </div>
  );

}

export default App;
