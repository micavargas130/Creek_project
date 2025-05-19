aleString("es", { month: "short" }),
    reservations: 0,
    occupancy: 0,
  }));

  bookings.forEach((booking) => {
    const date = new Date(booking.startDate); // Asumiendo que las reservas tienen startDate
    const monthIndex = date.getMonth();
    months[monthIndex].reservations++;

    // Suponemos duración en días y calculamos ocupación
    const daysInMonth = new Date(date.getFullYear(), monthIndex + 1, 0).getDate();
    months[monthIndex].occupancy = (months[monthIndex].reservations / (totalUnits * daysInMonth)) * 100;
  });

  return months;
};

const SeasonalAnalysisChart = ({ bookings }) => {
  const chartData = processSeasonalData(bookings);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis yAxisId="left" label={{ value: "Reservas", angle: -90, position: "insideLeft" }} />
        <YAxis yAxisId="right" orientation="right" label={{ value: "Ocupación %", angle: -90, position: "insideRight" }} />
        <Tooltip />
        <Legend />
        <Line yAxisId="left" type="monotone" dataKey="reservations" stroke="#8884d8" name="Reservas" />
        <Line yAxisId="right" type="monotone" dataKey="occupancy" stroke="#82ca9d" name="Ocupación %" />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default SeasonalAnalysisChart;
