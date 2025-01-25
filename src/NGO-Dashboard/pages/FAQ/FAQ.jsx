import { useState } from "react"

function ChevronIcon({ isOpen }) {
  return (
    <svg
      className={`w-6 h-6 transition-transform ${isOpen ? "rotate-180" : ""}`}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

const FAQ = () => {

  const [openIndex, setOpenIndex] = useState(0)

  const faqs = [
    {
      question: "What is Shoppiness Mart?",
      answer:
        "Shoppiness Mart is a shopping charity platform where users can support various causes and NGOs by shopping for their favorite products. A portion of each purchase is donated to the selected cause.",
    },
    {
      question: "How does Shoppiness Mart work?",
      answer:
        "Users shop for products through our platform, and a percentage of their purchase is automatically donated to their chosen cause or NGO.",
    },
    {
      question: "What types of products can I find on Shoppiness Mart?",
      answer:
        "We offer a wide range of products including electronics, fashion, home goods, and more from various trusted retailers.",
    },
    {
      question: "How do I know my donation is going to the right place?",
      answer:
        "We maintain full transparency with detailed tracking and regular reports on all donations made through our platform.",
    },
    {
      question: "What percentage of my purchase goes to the selected cause?",
      answer:
        "The donation percentage varies by product and retailer, typically ranging from 1% to 10% of the purchase price.",
    },
    {
      question: "Can I choose which cause or NGO to support?",
      answer: "Yes, you can select from our list of verified partner NGOs and causes to support with your purchases.",
    },
    {
      question: "How are the partner NGOs selected?",
      answer: "We carefully vet all partner NGOs through a rigorous selection process to ensure legitimacy and impact.",
    },
    {
      question: "How are the partner NGOs selected?",
      answer: "Our team conducts thorough background checks and impact assessments before partnering with any NGO.",
    },
  ]

  return (
    <div className="w-full p-10">
      <h1 className="text-2xl font-normal mb-8">Frequently Asked Questions (FAQs)</h1>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div key={index} className="border border-gray-100 rounded-lg shadow-sm bg-white overflow-hidden">
            <button
              onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
              className="w-full flex justify-between items-center p-4 text-left hover:bg-gray-50"
            >
              <span className="text-xl font-normal">{faq.question}</span>
              <ChevronIcon isOpen={openIndex === index} />
            </button>

            {openIndex === index && <div className="px-4 bg-gray-100 pb-4 text-gray-600 text-lg">{faq.answer}</div>}
          </div>
        ))}
      </div>
    </div>
  )
}
export default FAQ;
