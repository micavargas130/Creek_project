export const getTotalMoney = (data) => {
    if (!data || data.length === 0) {
      return 0;
    }
    return data.reduce((accumulator, currentValue) => {
      if (currentValue && currentValue.amount && currentValue.type && currentValue.status._id !== "cancelado") {
        console.log("current",currentValue)
        return currentValue.type === "Ingreso"
          ? accumulator + currentValue.amount
          : accumulator - currentValue.amount;
      } else {
        return accumulator;
      }
    }, 0);
  };
  
  export const getIncomes = (data) => {
    if (!data || data.length === 0) {
      return 0;
    }
    return data.reduce((accumulator, currentValue) => {
      if (currentValue && currentValue.amount && currentValue.type === "Ingreso" && currentValue.status._id !== "686f099aacd6f16c7fd3c905") {

        return accumulator + currentValue.amount;
      } else {
        return accumulator;
      }
    }, 0);
  };
  
  export const getExpenses = (data) => {
    if (!data || data.length === 0) {
      return 0;
    }
    return data.reduce((accumulator, currentValue) => {
      if (currentValue && currentValue.amount && currentValue.type === "Egreso") {
        return accumulator + currentValue.amount;
      } else {
        return accumulator;
      }
    }, 0);
  };
  