export const getTotalMoney = (data) => {
  if (!data || data.length === 0) {
    return 0;
  }

  return data.reduce((accumulator, currentValue) => {
    
    // Ignorar si no tiene status o si está cancelado
    if (
      !currentValue?.status || 
      currentValue.status._id === "686f099aacd6f16c7fd3c905"
    ) {
      return accumulator;
    }

    // Sumar o restar según el tipo
    if (currentValue.type === "Ingreso") {
      return accumulator + currentValue.amount;
    } else {
      return accumulator - currentValue.amount;
    }
  }, 0);
};

  
  export const getIncomes = (data) => {
    if (!data || data.length === 0) {
      return 0;
    }
    return data.reduce((accumulator, currentValue) => {
     console.log("current",currentValue)

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
  