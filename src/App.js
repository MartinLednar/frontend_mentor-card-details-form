import { useState } from "react";

import "./App.css";

const defaultFormData = {
  name: {
    value: "",
    error: "",
  },
  card: {
    value: "",
    error: "",
  },
  month: {
    value: "",
    error: "",
  },
  year: {
    value: "",
    error: "",
  },
  cvc: {
    value: "",
    error: "",
  },
};

const errorMessages = {
  blank: "Can't be blank",
  formatNum: "Wrong format, numbers only",
  formatStr: "Wrong format, letters only",
  date: "Wrong date",
};

function App() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState(defaultFormData);
  const { name, card, month, year, cvc } = formData;

  //Validation helper functions
  const containsOnlyLetters = (value) => {
    return /^[a-zA-Z]+$/.test(value) ? "" : "formatStr";
  };

  const containsOnlyNumbers = (value) => {
    return /^[0-9]+$/.test(value) ? "" : "formatNum";
  };

  const checkDate = (name, value) => {
    const currentDate = new Date();
    if (name === "month") {
      if (value[0] === "0") {
        if (value[1] >= 1 && value[1] <= 9) {
          return currentDate.getMonth() + 1 <= value[1] ? "" : "date";
        } else {
          return;
        }
      } else {
        return value >= 1 && value <= 12 && currentDate.getMonth() + 1 <= value ? "" : "date";
      }
    } else {
      const currentYear = currentDate.getFullYear().toString().slice(2);

      return currentYear <= value ? "" : "date";
    }
  };

  const isBlank = (value) => {
    return value.length !== 0 ? "" : "blank";
  };

  const formatCardNumber = (input) => {
    let newCardString = "";
    const numbersArray = input.split(" ");

    if (!numbersArray[0]) return;

    numbersArray.forEach((string) => {
      if (string.length % 4 === 0) {
        newCardString += string + " ";
      } else {
        newCardString += string;
      }
    });
    return newCardString.length > 19 ? newCardString.slice(0, -1) : newCardString;
  };

  const formatMonth = (month) => {
    return month < 10 && month.length < 2 ? `0${month}` : month;
  };
  //Validation helper functions

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "month" && value.length > 2) return;
    if (name === "year" && value.length > 2) return;
    if (name === "cvc" && value.length > 3) return;

    setFormData({ ...formData, [name]: { value, error: formData[name].error } });
  };

  const cardChange = (e) => {
    const { name, value } = e.target;

    if (value.length > 19) return;

    setFormData({ ...formData, [name]: { value: formatCardNumber(value), error: formData[name].error } });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    const newFormData = JSON.parse(JSON.stringify(formData));

    newFormData.name.error = isBlank(name.value) ? isBlank(name.value) : containsOnlyLetters(name.value.split(" ").join(""));
    newFormData.card.error = isBlank(card.value) ? isBlank(card.value) : containsOnlyNumbers(card.value.split(" ").join(""));
    newFormData.month.error = isBlank(month.value) ? isBlank(month.value) : checkDate("month", month.value);
    newFormData.year.error = isBlank(year.value) ? isBlank(year.value) : checkDate("year", year.value);
    newFormData.cvc.error = isBlank(cvc.value) ? isBlank(cvc.value) : containsOnlyNumbers(cvc.value);

    const allGood = Object.values(newFormData).every((item) => !item.error);

    if (allGood) {
      setFormData(newFormData);
      setTimeout(() => {
        setLoading(false);
        setSuccess(true);
      }, 2000);
    } else {
      setFormData(newFormData);
      setLoading(false);
    }
  };

  const handleReset = () => {
    setLoading(true);
    setTimeout(() => {
      setFormData(defaultFormData);
      setLoading(false);
      setSuccess(false);
    }, 2000);
  };

  return (
    <div className="content-wrapper">
      <div className="cards-container">
        <div className="cards-wrapper">
          <div className="card-container">
            <div className="card-details-container">
              <img src="/imgs/card-logo.svg" alt="Card logo" />

              <h1>{card.value ? card.value : "0000 0000 0000 0000"}</h1>
              <div className="card-details-group">
                <h2>{name.value ? name.value : "NAME SURNAME"}</h2>
                <h2>
                  {month.value ? formatMonth(month.value) : "MM"}/{year.value ? year.value : "YY"}
                </h2>
              </div>
            </div>
            <img className="front-card" src="/imgs/bg-card-front.png" alt="Front Card" />
          </div>

          <div className="card-container">
            <div className="card-details-container">
              <h2 className="number-back">{cvc.value ? cvc.value : "000"}</h2>
            </div>
            <img className="front-card" src="/imgs/bg-card-back.png" alt="Front Card" />
          </div>
        </div>
      </div>
      {!success && (
        <div className="form-container">
          <form>
            <div className="input-group">
              <label>Cardholder name</label>
              <input type="text" value={name.value} onChange={handleChange} name="name" className={name.error && "input-error"} placeholder="e.g. Jane Appleseed" />
              {name.error && <span className="error-message">{errorMessages[name.error]}</span>}
            </div>

            <div className="input-group">
              <label>Card number</label>
              <input type="text" name="card" value={card.value} onChange={cardChange} placeholder="e.g. 1234 5678 9123 0000" className={card.error && "input-error"} />
              {card.error && <span className="error-message">{errorMessages[card.error]}</span>}
            </div>

            <div className="input-groups">
              <div className="input-group">
                <label>Exp. date (MM/YY)</label>
                <div>
                  <input type="number" name="month" value={month.value} onChange={handleChange} placeholder="MM" className={month.error && "input-error"} />

                  <input type="number" name="year" value={year.value} onChange={handleChange} placeholder="YY" className={year.error && "input-error"} />
                </div>
                {(month.error || year.error) && <span className="error-message">{errorMessages[month.error || year.error]}</span>}
              </div>

              <div className="input-group">
                <label>CVC</label>
                <input type="text" name="cvc" value={cvc.value} onChange={handleChange} placeholder="e.g. 123" className={cvc.error && "input-error"} />
                {cvc.error && <span className="error-message">{errorMessages[cvc.error]}</span>}
              </div>
            </div>

            <button type="button" className="btn-submit" onClick={handleSubmit}>
              {loading ? <div className="spinner" /> : "Confirm"}
            </button>
          </form>
        </div>
      )}

      {success && (
        <div className="success-container">
          <div className="success-content-box">
            <img src="/imgs/icon-complete.svg" alt="Success icon" />
            <h2>Thank you!</h2>
            <p>We've added your card credentials.</p>
            <button type="button" className="btn-submit" onClick={handleReset}>
              {loading ? <div className="spinner" /> : "Continue"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
