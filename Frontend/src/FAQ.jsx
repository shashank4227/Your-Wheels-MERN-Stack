import React from "react";
import FAQItem from "./FAQItem";
import './FAQ.css';
import NavBar from "./NavBar";
import Footer from "./HomePage/Footer";
function FAQ() {
  const faqData = [
    { question: "1. What is YourWheels, and how does it work?", answer: "YourWheels is an all-in-one platform where users can buy, sell, and rent vehicles. Buyers can browse listings, sellers can showcase their vehicles, and renters can find vehicles for short-term use. The platform simplifies the process by connecting users directly while ensuring secure transactions and user verification" },
    { question: "2. How can I list my vehicle for sale on YourWheels?", answer: "Listing a vehicle is straightforward. First, create an account and log in. Navigate to the “List Vehicle” section, where you can provide details like make, model, year, mileage, and price. Add clear photos of your vehicle to attract buyers. Once you submit your listing, it will be reviewed for approval and then made live on the platform." },
    { question: "3. What types of vehicles can I find on YourWheels?", answer: "YourWheels offers a wide range of vehicles, including cars, motorcycles, trucks, and even recreational vehicles. Whether you’re looking for a compact car for daily use or a luxury vehicle for special occasions, the platform caters to diverse needs. You can filter your search by type, price, location, and other features to find the perfect match." },
    { question: "4. How does renting a vehicle through YourWheels work?", answer: "Renting is simple and user-friendly. Browse available rental listings, filter by your desired dates, and contact the vehicle owner for further details. Once you agree on terms, confirm the rental through the platform. Both parties can benefit from our partner insurance options to ensure a smooth and secure rental experience" },
    { question: "5. Are transactions on YourWheels secure?", answer: "Yes, YourWheels prioritizes security for all users. We use encrypted payment gateways to safeguard financial information and require user verification to ensure trustworthy interactions. Additionally, reviews and ratings help you assess the credibility of buyers, sellers, and renters before proceeding." },
    { question: "6. What if I encounter an issue during a transaction?", answer: "If you face a problem, whether it’s a dispute or technical issue, YourWheels has a dedicated support team ready to help. You can report the issue via the Help Center on the website or app. Our team will mediate between parties to find a resolution and ensure a positive experience for everyone involved." },
    { question: "7. Does YourWheels charge any fees for its services? ", answer: "YourWheels operates on a transparent fee structure. Sellers may pay a small listing fee or commission upon successful sales. For renters, service fees may apply depending on the transaction. Detailed pricing information is available on our Fees and Pricing page, ensuring there are no hidden surprises." },
    { question: "8. Can I cancel a rental or sale on YourWheels?", answer: "Yes, cancellations are allowed, but terms depend on the specific listing. For rentals, check the owner’s cancellation policy before confirming your booking. For sales, it’s recommended to communicate directly with the buyer or seller to address cancellations. Always review the policies outlined in the listing to avoid misunderstandings." },
    { question: "9. Can I negotiate the price of a vehicle on YourWheels?", answer: "Absolutely! Many sellers on YourWheels are open to negotiations. Once you find a vehicle you're interested in, you can contact the seller directly through the platform to discuss the price. We encourage users to communicate respectfully and finalize deals that are fair for both parties. Keep in mind that some listings may be marked as non-negotiable, so always check the listing details first." },
    { question: "10. What should I do before renting or buying a vehicle? ", answer: "Before committing to a rental or purchase, thoroughly review the vehicle's details and photos provided in the listing. If possible, schedule an inspection or test drive to ensure it meets your expectations. For rentals, clarify terms like duration, mileage limits, and fuel policy with the owner. For purchases, verify the vehicle's documentation, such as registration and insurance papers, to ensure everything is in order. YourWheels provides tools and guidelines to make these processes smooth and transparent." },
  ];

    return (
        <>
            <NavBar/>
            <div className="faq-parent">
                <h1>FAQ</h1>
                <div className="faq-container">
        {faqData.map((faq, index) => (
          <FAQItem key={index} question={faq.question} answer={faq.answer} />
        ))}
                </div>
      
            </div>
            <Footer/>
      </>
  
  );
}

export default FAQ;