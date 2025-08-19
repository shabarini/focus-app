import React, { useState, useEffect } from 'react';

const quotes = [
  {
    text: "Ваш ум — не для хранения идей, а для их создания. Незавершённые дела забирают у вас внимание, завершённые — возвращают его с прибылью",
    author: "Дэвид Аллен"
  },
  {
    text: "Секрет продвижения вперёд — начать. Закончив одно дело, вы обнаружите, что у вас есть силы для следующего",
    author: "Марк Твен"
  },
  {
    text: "Незавершённая работа гложет душу, завершённая — освобождает",
    author: "Леонардо да Винчи"
  },
  {
    text: "Люди часто ждут мотивации, чтобы действовать. Но мотивация приходит после действия, а не до него",
    author: "Зиг Зиглар"
  },
  {
    text: "Чувство выполненного дела даёт энергию для следующего шага",
    author: "Стивен Кови"
  },
  {
    text: "Лучший способ сделать что-то — просто сделать это",
    author: "Амелия Эрхарт"
  },
  {
    text: "Время тратится не на то, чтобы делать, а на то, чтобы решиться делать",
    author: "Томас Эдисон"
  },
  {
    text: "Нет ничего особенно трудного, если разделить работу на маленькие задачи",
    author: "Генри Форд"
  },
  {
    text: "Мы — то, что мы делаем постоянно. Совершенство — это не действие, а привычка",
    author: "Аристотель"
  },
  {
    text: "Делайте сегодня то, что другие не хотят, и завтра будете жить так, как другие не могут",
    author: "Наполеон Хилл"
  },
  {
    text: "Никогда не откладывай на завтра то, что можно сделать сегодня",
    author: "Бенджамин Франклин"
  },
  {
    text: "Усталость делает нас слабыми, но чувство выполненного долга делает нас сильнее",
    author: "Винс Ломбарди"
  },
  {
    text: "Поступок — лучший перевод мысли",
    author: "Ральф Уолдо Эмерсон"
  },
  {
    text: "Вдохновение существует, но оно должно застать вас за работой",
    author: "Пабло Пикассо"
  },
  {
    text: "Пока мы откладываем жизнь — она проходит",
    author: "Сенека"
  }
];

const QuoteCarousel: React.FC = () => {
  const [currentQuote, setCurrentQuote] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentQuote((prev) => (prev + 1) % quotes.length);
        setIsVisible(true);
      }, 300);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  const nextQuote = () => {
    setIsVisible(false);
    setTimeout(() => {
      setCurrentQuote((prev) => (prev + 1) % quotes.length);
      setIsVisible(true);
    }, 300);
  };

  const prevQuote = () => {
    setIsVisible(false);
    setTimeout(() => {
      setCurrentQuote((prev) => (prev - 1 + quotes.length) % quotes.length);
      setIsVisible(true);
    }, 300);
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      minHeight: '60px'
    }}>
      <div style={{
        textAlign: 'center',
        overflow: 'hidden',
        maxWidth: '100%'
      }}>
        <div style={{
          opacity: isVisible ? 1 : 0,
          transform: `translateY(${isVisible ? '0' : '10px'})`,
          transition: 'all 0.3s ease-in-out'
        }}>
                     <div style={{
             fontSize: '14px',
             lineHeight: '1.5',
             color: '#666',
             fontStyle: 'italic',
             marginBottom: '4px'
           }}>
             {quotes[currentQuote].text}
           </div>
          <div style={{
            fontSize: '12px',
            color: '#999',
            fontWeight: '500'
          }}>
            — {quotes[currentQuote].author}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuoteCarousel;
