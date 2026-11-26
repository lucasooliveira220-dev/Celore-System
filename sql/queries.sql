-- =======================================
-- 6x Functional Requirements in Query Form
-- =======================================

-- Query 1: Service a Vehicle
-- Shows customer, mechanic(s), and full service details for a given VIN
SELECT Customer.Name, Employee.Name, Service.Start_Mileage, Service.End_Mileage, Service.Estimated_Cost, Service.Final_Cost
FROM Service JOIN Customer ON Service.C_ID = Customer.Customer_ID
JOIN ServiceEmployee ON ServiceEmployee.Serv_ID = Service.Service_ID
JOIN Employee ON ServiceEmployee.E_ID = Employee.Employee_ID
JOIN Vehicle ON Vehicle.VIN = Service.VIN
WHERE Vehicle.VIN = '1FTFW1ET5DFC08321';

-- Query 2: Getting Customer Billing Information
-- Returns all billing records (sales + services) for a specific customer
SELECT Customer.Name, Service.Final_Cost, Vehicle.Price, Sales.Date,
       CASE WHEN Billing.Sale_ID IS NOT NULL THEN 'Sale' ELSE 'Service' END AS transaction_type
FROM Billing JOIN Customer ON Billing.C_ID = Customer.Customer_ID
LEFT JOIN Service ON Service.Service_ID = Billing.Serv_ID
LEFT JOIN Sales ON Sales.Sale_ID = Billing.Sale_ID
LEFT JOIN Vehicle ON Sales.VIN = Vehicle.VIN
WHERE Customer.Customer_ID = 4;

-- Query 3: Insert a new Customer into the Database
-- Idempotent insert — skips if email already exists
INSERT INTO Customer (Name, Address, P_Number, Email, Type)
SELECT * FROM (SELECT 'Test User', '123 Test St', '5551234567', 'test@email.com', 'purchase') AS tmp
WHERE NOT EXISTS (SELECT 1 FROM Customer WHERE Email = 'test@email.com');

-- Query 4: Insert a new Vehicle into the Database
-- Transactional: inserts Vehicle then Inventory row atomically
START TRANSACTION;
INSERT INTO Vehicle (VIN, Make, Model, Year, Price, Status)
VALUES ('TEST0000000000001', 'Toyota', 'Camry', 2024, 27000.00, 'inventory');
INSERT INTO Inventory (VIN, Location)
VALUES ('TEST0000000000001', 'main_lot');
COMMIT;

-- Query 5: Sell a Vehicle
-- Transactional: marks vehicle sold, records sale, removes from inventory
START TRANSACTION;
UPDATE Vehicle SET Status = 'sold' WHERE VIN = '1HGCM82633A004856';
INSERT INTO Sales (VIN, C_ID, Temp_Tag, Date, Customization)
VALUES ('1HGCM82633A004856', 1, 'TMP-20240425-004', '2024-04-25', NULL);
DELETE FROM Inventory WHERE VIN = '1HGCM82633A004856';
COMMIT;

-- Query 6: Daily Operational Report
-- All billing activity (sales + services) for a given date
SELECT c.Name, v.Price, COALESCE(serv.Final_Cost, v.Price) AS Amount, b.Date
FROM Sales s RIGHT JOIN Billing b ON s.Sale_ID = b.Sale_ID
LEFT JOIN Service serv ON serv.Service_ID = b.Serv_ID
JOIN Customer c ON c.Customer_ID = b.C_ID
LEFT JOIN Vehicle v ON v.VIN = s.VIN
WHERE b.Date = '2024-03-10';


-- ====================================
-- Four Additional Meaningful Queries
-- ====================================

-- Query 7: Available Inventory
-- All vehicles currently in inventory, sorted by lot location
SELECT * FROM Vehicle v
JOIN Inventory i ON v.VIN = i.VIN
WHERE v.Status = 'inventory'
ORDER BY i.Location;

-- Query 8: Vehicle Service History
-- Full service history for a specific VIN, ordered chronologically
SELECT s.VIN, s.Start_Mileage, s.End_Mileage, s.Work_Performed
FROM Service s
WHERE s.VIN = '1FTFW1ET5DFC08321'
ORDER BY s.Service_ID;

-- Query 9: Revenue Summary
-- Sales vs service revenue broken out per billing date
SELECT SUM(serv.Final_Cost) AS service_revenue, SUM(v.Price) AS sales_revenue, b.Date
FROM Billing b
LEFT JOIN Service serv ON b.Serv_ID = serv.Service_ID
LEFT JOIN Sales s ON s.Sale_ID = b.Sale_ID
LEFT JOIN Vehicle v ON v.VIN = s.VIN
GROUP BY b.Date
ORDER BY b.Date DESC;

-- Query 10: Mechanic Workload
-- Number of service jobs per mechanic, ranked by busiest
SELECT COUNT(*) AS workload, e.Name
FROM ServiceEmployee se
JOIN Employee e ON se.E_ID = e.Employee_ID
GROUP BY e.Name
ORDER BY workload DESC;
