import axios from 'axios';
import { useEffect, useState } from 'react';

type Card = {
  _id?: string;
  title: string;
  numericValue: string | number;
  description: string;
};

const AboutCard = ({ card }: { card: Card }) => {
  const [count, setCount] = useState<number>(0);
  const [suffix, setSuffix] = useState<string>("");

  useEffect(() => {
    let rawValue = card.numericValue.toString().trim();

    // Extract number + suffix (e.g., "100+" -> 100 + "+")
    const match = rawValue.match(/^(\d+(?:,\d+)*)(.*)$/);
    if (!match) {
      // No numeric part → just show it directly
      setCount(NaN);
      setSuffix("");
      return;
    }

    const numericPart = parseInt(match[1].replace(/,/g, ""), 10);
    const extra = match[2] || "";

    setSuffix(extra);

    let current = 0;
    const step = Math.ceil(numericPart / 30);

    const interval = setInterval(() => {
      current += step;
      if (current >= numericPart) {
        clearInterval(interval);
        setCount(numericPart);
      } else {
        setCount(current);
      }
    }, 30);

    return () => clearInterval(interval);
  }, [card.numericValue]);

  const displayValue = isNaN(count)
    ? card.numericValue // fallback to raw string if not animatable
    : `${count}${suffix}`;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
      <h2 style={{ fontSize: "40px", margin: '0' }}>{card.title}</h2>
      <p style={{ fontWeight: "400", fontSize: "78px", margin: "0", lineHeight: "78px" }}>
        {displayValue}
      </p>
      <p style={{ fontSize: "18px", lineHeight: "24px", textAlign: "left" }}>{card.description}</p>
    </div>
  );
};

const ShimmerCard = () => {
  return (
    <div className="shimmer-card">
      <div className="shimmer-title"></div>
      <div className="shimmer-number"></div>
      <div className="shimmer-description"></div>
    </div>
  );
};

export const AboutCards = () => {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/home/about-us');
        if (response.data?.content) {
          setCards(response.data.content);
        } else {
          throw new Error("No content field found in response.");
        }
      } catch (err) {
        console.error("Failed to fetch About Us data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAboutData();
  }, []);

  return (
    <div className="p-7 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5">
      {loading
        ? [1, 2, 3, 4].map((_, index) => <ShimmerCard key={index} />)
        : cards.map((card) => (
            <AboutCard key={card._id || card.title} card={card} />
          ))}
    </div>
  );
};
