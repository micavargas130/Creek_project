<div className="home">
  <Sidebar />
  <div className="homeContainer">
    <Navbar />
    <h2>Bienvenido {user.first_name} {user.last_name}</h2>

    {/* Widgets financieros SOLO si no es empleado */}
    {!user.isEmployee && (
      <div className="financialWidgets">
        <WidgetsContainer 
          totalMoney={totalMoney} 
          totalIncome={totalIncome} 
          totalExpense={totalExpense} 
          occupiedLodges={occupiedCount} 
          totalLodges={totalLodges}
          occupiedTents={tentCount}
          totalTents={totalTents}
        />
      </div>
    )}

    {/* Si es empleado, mostrar el calendario con tareas */}
    {user.isEmployee && (
      <div className="employeeCalendar">
        <h3>Tus tareas asignadas</h3>
        <div className="calendarCard">
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 400 }}
          />
        </div>
      </div>
    )}

    {/* Mapa y notificaciones (se muestran a todos) */}
    <div className="charts">
      <MapComponent lodgesInfo={lodgesInfo} />
      <Notifications />
    </div>
  </div>
</div>
