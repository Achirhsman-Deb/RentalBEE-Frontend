import { useState, useEffect } from "react";
import { Plus, X } from "lucide-react";
import axios from "axios";

interface FAQ {
  _id: string;
  question: string;
  answer: string;
}

const FAQSection: React.FC = () => {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [activeIndex, setActiveIndex] = useState<number | null>(null); // start collapsed

  useEffect(() => {
    const fetchFAQs = async () => {
      try {
        const response = await axios.get("http://localhost:5000/home/faq");

        // ✅ Fix: Axios stores result inside `data`
        const fetchedFAQs: FAQ[] = response.data?.content || [];
        setFaqs(fetchedFAQs);
      } catch (err) {
        console.error("Error fetching FAQ data:", err);
      }
    };

    fetchFAQs();
  }, []);

  return (
    <div className="bg-[#FDFBF6] flex flex-col md:flex-row items-start gap-6">
      {/* Left side title */}
      <div className="w-full md:w-[30%]">
        <p className="text-[22px] font-medium text-[#666666]">(FAQ)</p>
      </div>

      {/* Right side FAQs */}
      <div className="w-full md:w-[70%] p-7 rounded-md">
        {faqs.length === 0 ? (
          // Shimmer effect while loading
          <div className="space-y-6">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="shimmer-container">
                <div className="shimmer-question"></div>
                <div className="shimmer-answer"></div>
              </div>
            ))}
          </div>
        ) : (
          faqs.map((faq, index) => (
            <div
              key={faq._id}
              className="border-b border-gray-300 py-6 px-3"
            >
              {/* Question Row */}
              <div className="flex justify-between items-start">
                <h3 className="text-2xl font-medium text-black max-w-[90%] max-[600px]:text-xl">
                  {faq.question}
                </h3>
                <span
                  className="cursor-pointer flex justify-center items-center transition-transform duration-300 ease-in-out border h-7 w-7 rounded-full"
                  onClick={() =>
                    setActiveIndex(index === activeIndex ? null : index)
                  }
                >
                  {index === activeIndex ? (
                    <X className="h-5 w-5 text-gray-600 transition-transform duration-300 rotate-90" />
                  ) : (
                    <Plus className="h-5 w-5 text-gray-600 transition-transform duration-300" />
                  )}
                </span>
              </div>

              {/* Answer Section */}
              <div
                className={`transition-all duration-500 ease-in-out overflow-hidden ${
                  index === activeIndex
                    ? "max-h-96 opacity-100 mt-2"
                    : "max-h-0 opacity-0"
                }`}
              >
                <p className="text-gray-700 text-md leading-relaxed max-[600px]:text-sm">
                  {faq.answer || "Answer to this question is not available at the moment."}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default FAQSection;
