CREATE DATABASE IF NOT EXISTS dealership CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE dealership;
SET NAMES utf8mb4;

CREATE TABLE Customer (
	Customer_ID INT AUTO_INCREMENT PRIMARY KEY,
	Name VARCHAR(255) NOT NULL,
	Address VARCHAR(255),
	P_Number VARCHAR(15),
	Email VARCHAR(255),
	Type ENUM('purchase', 'service', 'visit')
);

CREATE TABLE Employee (
	Employee_ID INT AUTO_INCREMENT PRIMARY KEY,
	Name VARCHAR(255) NOT NULL,
	Address VARCHAR(255),
	P_Number VARCHAR(15),
	Email VARCHAR(255),
	Type ENUM('mechanic', 'salesperson', 'billing')
);

CREATE TABLE Vehicle (
	VIN CHAR(17) NOT NULL PRIMARY KEY,
	Make VARCHAR(255),
	Model VARCHAR(255),
	Year YEAR,
	Price DECIMAL(10,2),
	Status ENUM('inventory', 'sold', 'leased', 'in_service'),
	Motor_W INT,
	Max_Speed INT,
	Range_Km INT,
	Battery VARCHAR(60)
);

CREATE TABLE Inventory (
	VIN CHAR(17) NOT NULL PRIMARY KEY,
		FOREIGN KEY (VIN) REFERENCES Vehicle(VIN),
	`Location` ENUM('main_lot', 'remote_lot', 'other_dealership', 'in_transit')
);

CREATE TABLE Service (
	Service_ID INT AUTO_INCREMENT PRIMARY KEY,
	VIN CHAR(17) NOT NULL,
		FOREIGN KEY (VIN) REFERENCES Vehicle(VIN),
	C_ID INT NOT NULL,
		FOREIGN KEY (C_ID) REFERENCES Customer(Customer_ID),
	Start_Mileage INT,
	End_Mileage INT,
	Estimated_Cost DECIMAL(10, 2),
	Work_Performed TEXT,
	Final_Cost DECIMAL(10,2),
	Status ENUM('aberta','aguardando_peca','em_reparo','pronta','faturada','cancelada') NOT NULL DEFAULT 'aberta',
	Opened_Date DATE
);

CREATE TABLE ServiceEmployee (
	Serv_ID INT NOT NULL,
		FOREIGN KEY (Serv_ID) REFERENCES Service(Service_ID),
	E_ID INT NOT NULL,
		FOREIGN KEY (E_ID) REFERENCES Employee(Employee_ID),
	PRIMARY KEY (Serv_ID, E_ID)
);

CREATE TABLE Sales (
	Sale_ID INT AUTO_INCREMENT PRIMARY KEY,
	VIN CHAR(17) NOT NULL,
		FOREIGN KEY (VIN) REFERENCES Vehicle(VIN),
	C_ID INT NOT NULL,
		FOREIGN KEY (C_ID) REFERENCES Customer(Customer_ID),
	Temp_Tag VARCHAR(20),
	Date DATE NOT NULL,
	Customization TEXT
);

CREATE TABLE Billing (
	Billing_ID INT AUTO_INCREMENT PRIMARY KEY,
	Sale_ID INT,
		FOREIGN KEY (Sale_ID) REFERENCES Sales(Sale_ID),
	Serv_ID INT,
		FOREIGN KEY (Serv_ID) REFERENCES Service(Service_ID),
	C_ID INT NOT NULL,
		FOREIGN KEY (C_ID) REFERENCES Customer(Customer_ID),
	Payment_Method ENUM('cash', 'credit', 'debit', 'financing', 'check') NOT NULL,
	Date DATE NOT NULL,
	CONSTRAINT chk_billing_xor
		CHECK (
			(Sale_ID IS NOT NULL AND Serv_ID IS NULL)
				OR
			(Sale_ID IS NULL AND Serv_ID IS NOT NULL)
		)
);

-- Views
CREATE OR REPLACE VIEW Mechanic AS
SELECT c.Name AS Customer_Name, s.VIN, s.Start_Mileage, s.End_Mileage, s.Estimated_Cost, s.Work_Performed, s.Final_Cost, e.Name AS Employee_Name
FROM Service s JOIN Customer c ON s.C_ID = c.Customer_ID
JOIN ServiceEmployee se ON s.Service_ID = se.Serv_ID
JOIN Employee e ON se.E_ID = e.Employee_ID;

CREATE OR REPLACE VIEW SalespersonInv AS
SELECT v.Year, v.Make, v.Model, i.VIN, v.Price, v.Status, i.Location
FROM Inventory i JOIN Vehicle v ON i.VIN = v.VIN;

CREATE OR REPLACE VIEW SalespersonSales AS
SELECT v.Year, v.Make, v.Model, i.VIN, v.Price, c.Name AS Customer_Name, s.Date
FROM Sales s JOIN Vehicle v ON s.VIN = v.VIN
JOIN Customer c ON s.C_ID = c.Customer_ID
LEFT JOIN Inventory i ON v.VIN = i.VIN;

CREATE OR REPLACE VIEW BillingView AS
SELECT c.Name, b.Payment_Method,
	CASE WHEN b.Sale_ID IS NOT NULL THEN 'Sale' ELSE 'Service' END AS Transaction_Type,
	CASE WHEN b.Sale_ID IS NOT NULL THEN v.Price ELSE serv.Final_Cost END AS Amount
FROM Billing b JOIN Customer c ON b.C_ID = c.Customer_ID
LEFT JOIN Service serv ON b.Serv_ID = serv.Service_ID
LEFT JOIN Sales s ON b.Sale_ID = s.Sale_ID
LEFT JOIN Vehicle v ON s.VIN = v.VIN;

-- ═══════════════════════════════════════════════════════════════════════
-- Módulos Celore DMS (peças, estoque, oficina, comercial, fiscal, sistema)
-- ═══════════════════════════════════════════════════════════════════════

CREATE TABLE AppUser (
	User_ID INT AUTO_INCREMENT PRIMARY KEY,
	Employee_ID INT,
		FOREIGN KEY (Employee_ID) REFERENCES Employee(Employee_ID),
	Username VARCHAR(60) NOT NULL UNIQUE,
	Password_Hash VARCHAR(255) NOT NULL,
	Role ENUM('admin', 'salesperson', 'mechanic', 'billing', 'stock') NOT NULL DEFAULT 'salesperson',
	Active BOOLEAN NOT NULL DEFAULT TRUE
);

-- Atalhos fixados por usuário. Function_Key = id da função no front (ex.: 'os', 'pecas').
CREATE TABLE UserFavorite (
	User_ID INT NOT NULL,
		FOREIGN KEY (User_ID) REFERENCES AppUser(User_ID),
	Function_Key VARCHAR(40) NOT NULL,
	Position INT NOT NULL DEFAULT 0,
	PRIMARY KEY (User_ID, Function_Key)
);

-- ═══ Módulo: Cadastros base (complemento) ═══════════════════════════════════

-- Fornecedor de peças/mercadorias (usado nas compras).
CREATE TABLE Supplier (
	Supplier_ID INT AUTO_INCREMENT PRIMARY KEY,
	Name VARCHAR(255) NOT NULL,
	CNPJ VARCHAR(18),
	Address VARCHAR(255),
	P_Number VARCHAR(15),
	Email VARCHAR(255)
);

-- ═══ Módulo: Peças & Estoque ════════════════════════════════════════════════

-- Catálogo de peças/mercadorias.
CREATE TABLE Part (
	Part_ID INT AUTO_INCREMENT PRIMARY KEY,
	Code VARCHAR(40) NOT NULL UNIQUE,
	Description VARCHAR(255) NOT NULL,
	Category VARCHAR(80),
	Unit ENUM('un', 'pc', 'lt', 'kg', 'par') NOT NULL DEFAULT 'un',
	Sale_Price DECIMAL(10,2) NOT NULL DEFAULT 0,
	Min_Stock INT NOT NULL DEFAULT 0
);

-- Livro-razão do estoque. Quantity é ASSINADA: entrada (+), saída (−).
-- O saldo de qualquer peça = SUM(Quantity). Nunca se guarda saldo fixo.
CREATE TABLE StockMovement (
	Movement_ID INT AUTO_INCREMENT PRIMARY KEY,
	Part_ID INT NOT NULL,
		FOREIGN KEY (Part_ID) REFERENCES Part(Part_ID),
	Type ENUM('in', 'out', 'adjust') NOT NULL,
	Quantity INT NOT NULL,
	Unit_Cost DECIMAL(10,2),
	Origin ENUM('purchase', 'service', 'sale', 'adjustment', 'xml_import') NOT NULL,
	Reference_ID INT,
	Movement_Date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
	Note VARCHAR(255)
);

-- Pedido de compra + itens.
CREATE TABLE PurchaseOrder (
	PO_ID INT AUTO_INCREMENT PRIMARY KEY,
	Supplier_ID INT NOT NULL,
		FOREIGN KEY (Supplier_ID) REFERENCES Supplier(Supplier_ID),
	Order_Date DATE NOT NULL,
	Status ENUM('draft', 'sent', 'received', 'cancelled') NOT NULL DEFAULT 'draft',
	Total DECIMAL(12,2)
);

CREATE TABLE PurchaseOrderItem (
	PO_ID INT NOT NULL,
		FOREIGN KEY (PO_ID) REFERENCES PurchaseOrder(PO_ID),
	Part_ID INT NOT NULL,
		FOREIGN KEY (Part_ID) REFERENCES Part(Part_ID),
	Quantity INT NOT NULL,
	Unit_Cost DECIMAL(10,2) NOT NULL,
	PRIMARY KEY (PO_ID, Part_ID)
);

-- Requisição interna de peças (ex.: mecânico pedindo peça pra uma OS).
CREATE TABLE Requisition (
	Req_ID INT AUTO_INCREMENT PRIMARY KEY,
	Employee_ID INT NOT NULL,
		FOREIGN KEY (Employee_ID) REFERENCES Employee(Employee_ID),
	Serv_ID INT,
		FOREIGN KEY (Serv_ID) REFERENCES Service(Service_ID),
	Req_Date DATE NOT NULL,
	Status ENUM('open', 'fulfilled', 'cancelled') NOT NULL DEFAULT 'open'
);

CREATE TABLE RequisitionItem (
	Req_ID INT NOT NULL,
		FOREIGN KEY (Req_ID) REFERENCES Requisition(Req_ID),
	Part_ID INT NOT NULL,
		FOREIGN KEY (Part_ID) REFERENCES Part(Part_ID),
	Quantity INT NOT NULL,
	PRIMARY KEY (Req_ID, Part_ID)
);

-- ═══ Módulo: Oficina & Pós-vendas ═══════════════════════════════════════════
-- (a coluna Status já está definida direto na tabela Service, acima)

-- Peças usadas numa Ordem de Serviço (liga Service ↔ Part).
CREATE TABLE ServicePart (
	Serv_ID INT NOT NULL,
		FOREIGN KEY (Serv_ID) REFERENCES Service(Service_ID),
	Part_ID INT NOT NULL,
		FOREIGN KEY (Part_ID) REFERENCES Part(Part_ID),
	Quantity INT NOT NULL,
	Unit_Price DECIMAL(10,2) NOT NULL,
	PRIMARY KEY (Serv_ID, Part_ID)
);

-- Agendamento de oficina/atendimento.
CREATE TABLE Appointment (
	Appointment_ID INT AUTO_INCREMENT PRIMARY KEY,
	C_ID INT NOT NULL,
		FOREIGN KEY (C_ID) REFERENCES Customer(Customer_ID),
	VIN CHAR(17),
		FOREIGN KEY (VIN) REFERENCES Vehicle(VIN),
	Employee_ID INT,
		FOREIGN KEY (Employee_ID) REFERENCES Employee(Employee_ID),
	Scheduled_For DATETIME NOT NULL,
	Reason VARCHAR(255),
	Status ENUM('scheduled', 'done', 'cancelled', 'no_show') NOT NULL DEFAULT 'scheduled'
);

-- Revisão programada (1.000 km, 5.000 km...). Liga ao veículo e à OS que a cumpriu.
CREATE TABLE Revision (
	Revision_ID INT AUTO_INCREMENT PRIMARY KEY,
	VIN CHAR(17) NOT NULL,
		FOREIGN KEY (VIN) REFERENCES Vehicle(VIN),
	Serv_ID INT,
		FOREIGN KEY (Serv_ID) REFERENCES Service(Service_ID),
	Plan_Mileage INT NOT NULL,
	Due_Date DATE,
	Status ENUM('pending', 'done', 'overdue') NOT NULL DEFAULT 'pending'
);

-- Garantia (cobre veículo, peça ou serviço).
CREATE TABLE Warranty (
	Warranty_ID INT AUTO_INCREMENT PRIMARY KEY,
	Coverage ENUM('vehicle', 'part', 'service') NOT NULL,
	VIN CHAR(17),
		FOREIGN KEY (VIN) REFERENCES Vehicle(VIN),
	Part_ID INT,
		FOREIGN KEY (Part_ID) REFERENCES Part(Part_ID),
	Serv_ID INT,
		FOREIGN KEY (Serv_ID) REFERENCES Service(Service_ID),
	Start_Date DATE NOT NULL,
	End_Date DATE NOT NULL,
	Terms TEXT
);

-- ═══ Módulo: Comercial ══════════════════════════════════════════════════════

-- Orçamento (pode virar venda ou OS).
CREATE TABLE Quote (
	Quote_ID INT AUTO_INCREMENT PRIMARY KEY,
	C_ID INT NOT NULL,
		FOREIGN KEY (C_ID) REFERENCES Customer(Customer_ID),
	VIN CHAR(17),
		FOREIGN KEY (VIN) REFERENCES Vehicle(VIN),
	Type ENUM('sale', 'service') NOT NULL,
	Quote_Date DATE NOT NULL,
	Valid_Until DATE,
	Total DECIMAL(12,2),
	Status ENUM('open', 'approved', 'rejected', 'expired') NOT NULL DEFAULT 'open'
);

-- Reserva de veículo por um cliente.
CREATE TABLE Reservation (
	Reservation_ID INT AUTO_INCREMENT PRIMARY KEY,
	VIN CHAR(17) NOT NULL,
		FOREIGN KEY (VIN) REFERENCES Vehicle(VIN),
	C_ID INT NOT NULL,
		FOREIGN KEY (C_ID) REFERENCES Customer(Customer_ID),
	Reserved_At DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
	Expires_At DATETIME,
	Status ENUM('active', 'converted', 'expired', 'cancelled') NOT NULL DEFAULT 'active'
);

-- ═══ Módulo: Fiscal & Financeiro ════════════════════════════════════════════

-- Nota fiscal (venda, serviço ou compra). Number comporta a chave de 44 dígitos da NF-e.
CREATE TABLE Invoice (
	Invoice_ID INT AUTO_INCREMENT PRIMARY KEY,
	Number VARCHAR(44),
	Kind ENUM('sale', 'service', 'purchase') NOT NULL,
	Sale_ID INT,
		FOREIGN KEY (Sale_ID) REFERENCES Sales(Sale_ID),
	Serv_ID INT,
		FOREIGN KEY (Serv_ID) REFERENCES Service(Service_ID),
	PO_ID INT,
		FOREIGN KEY (PO_ID) REFERENCES PurchaseOrder(PO_ID),
	Issue_Date DATE NOT NULL,
	Total DECIMAL(12,2) NOT NULL,
	XML_Imported BOOLEAN NOT NULL DEFAULT FALSE
);

-- Lançamento financeiro (contas a pagar/receber).
CREATE TABLE AccountEntry (
	Entry_ID INT AUTO_INCREMENT PRIMARY KEY,
	Direction ENUM('receivable', 'payable') NOT NULL,
	C_ID INT,
		FOREIGN KEY (C_ID) REFERENCES Customer(Customer_ID),
	Supplier_ID INT,
		FOREIGN KEY (Supplier_ID) REFERENCES Supplier(Supplier_ID),
	Invoice_ID INT,
		FOREIGN KEY (Invoice_ID) REFERENCES Invoice(Invoice_ID),
	Amount DECIMAL(12,2) NOT NULL,
	Due_Date DATE NOT NULL,
	Paid_Date DATE,
	Status ENUM('open', 'paid', 'overdue', 'cancelled') NOT NULL DEFAULT 'open'
);

-- ─── Views (relatórios derivados — sem duplicar dados) ──────────────────────

-- Ficha Kardex: extrato de movimentos de cada peça com saldo acumulado.
CREATE OR REPLACE VIEW KardexView AS
SELECT
	m.Part_ID,
	p.Code,
	p.Description,
	m.Movement_Date,
	m.Type,
	m.Quantity,
	SUM(m.Quantity) OVER (PARTITION BY m.Part_ID ORDER BY m.Movement_Date, m.Movement_ID) AS Balance
FROM StockMovement m
JOIN Part p ON m.Part_ID = p.Part_ID;

-- Saldo atual de cada peça (e alerta de estoque mínimo).
CREATE OR REPLACE VIEW PartStock AS
SELECT
	p.Part_ID,
	p.Code,
	p.Description,
	p.Min_Stock,
	COALESCE(SUM(m.Quantity), 0) AS On_Hand
FROM Part p
LEFT JOIN StockMovement m ON p.Part_ID = m.Part_ID
GROUP BY p.Part_ID, p.Code, p.Description, p.Min_Stock;

-- Extrato de Contas: lançamentos com o nome da parte (cliente ou fornecedor).
CREATE OR REPLACE VIEW AccountStatement AS
SELECT
	a.Entry_ID,
	a.Direction,
	a.Amount,
	a.Due_Date,
	a.Paid_Date,
	a.Status,
	COALESCE(c.Name, s.Name) AS Party
FROM AccountEntry a
LEFT JOIN Customer c ON a.C_ID = c.Customer_ID
LEFT JOIN Supplier s ON a.Supplier_ID = s.Supplier_ID;

-- Ficha Financeira do cliente: saldo em aberto e total já pago.
CREATE OR REPLACE VIEW CustomerLedger AS
SELECT
	c.Customer_ID,
	c.Name,
	SUM(CASE WHEN a.Status = 'open' THEN a.Amount ELSE 0 END) AS Open_Balance,
	SUM(CASE WHEN a.Status = 'paid' THEN a.Amount ELSE 0 END) AS Total_Paid
FROM Customer c
LEFT JOIN AccountEntry a ON a.C_ID = c.Customer_ID AND a.Direction = 'receivable'
GROUP BY c.Customer_ID, c.Name;

-- ═══════════════════════════════════════════════════════════════════════
-- Módulo: Estoque de Veículos (livro-razão de entrada/saída por modelo)
-- ═══════════════════════════════════════════════════════════════════════
CREATE TABLE VehicleMovement (
	Movement_ID INT AUTO_INCREMENT PRIMARY KEY,
	Make VARCHAR(255) NOT NULL,
	Model VARCHAR(255) NOT NULL,
	Type ENUM('in', 'out', 'adjust') NOT NULL,
	Quantity INT NOT NULL,
	Unit_Cost DECIMAL(10,2),
	Movement_Date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
	Note VARCHAR(255)
);

-- Saldo atual de veículos por modelo (soma dos movimentos)
CREATE OR REPLACE VIEW VehicleStock AS
SELECT
	Make,
	Model,
	COALESCE(SUM(Quantity), 0) AS On_Hand,
	MAX(Movement_Date) AS Last_Movement
FROM VehicleMovement
GROUP BY Make, Model;
