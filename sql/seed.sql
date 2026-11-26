USE dealership;
SET NAMES utf8mb4;

-- Employees: Kyle (salesperson), Raaj (mechanic), Arnav (billing), plus supporting staff
INSERT INTO Employee (Name, Address, P_Number, Email, Type) VALUES
('Pelé',       '123 Main St, Bowling Green, KY 42101',        '2705550101', 'pele@celore.com.br',      'salesperson'),
('Garrincha',        '456 College Ave, Bowling Green, KY 42101',     '2705550102', 'garrincha@celore.com.br',       'mechanic'),
('Chico Buarque',   '789 University Blvd, Bowling Green, KY 42101', '2705550103', 'chico.buarque@celore.com.br',  'billing'),
('Sócrates Brasileiro',       '111 Garage Ln, Bowling Green, KY 42101',       '2705550108', 'socrates@celore.com.br',      'mechanic'),
('Fernanda Montenegro',     '222 Sales Blvd, Bowling Green, KY 42101',      '2705550109', 'fernanda.montenegro@celore.com.br',    'salesperson'),
('Cartola',     '333 Commerce Dr, Bowling Green, KY 42101',     '2705550110', 'cartola@celore.com.br',    'mechanic'),
('Gal Costa',       '444 Finance Ave, Bowling Green, KY 42103',     '2705550111', 'gal.costa@celore.com.br',      'billing');

-- Customers: Prof. Xia + realistic diverse customers (not employees)
INSERT INTO Customer (Name, Address, P_Number, Email, Type) VALUES
('Ayrton Senna',     '321 Faculty Dr, Bowling Green, KY 42101',      '2705550104', 'ayrton.senna@email.com',           'service'),
('Tom Jobim',    '1 Big Red Way, Bowling Green, KY 42101',        '2705550105', 'tom.jobim@email.com',          'visit'),
('Clarice Lispector',    '654 Elm St, Bowling Green, KY 42103',           '2705550106', 'clarice.lispector@email.com',        'purchase'),
('Oscar Niemeyer',    '987 Oak Ave, Bowling Green, KY 42104',          '2705550107', 'oscar.niemeyer@email.com',        'service'),
('Elis Regina',    '210 Riverside Dr, Bowling Green, KY 42101',     '2705550112', 'elis.regina@email.com',        'purchase'),
('Santos Dumont',         '75 Hilltop Rd, Bowling Green, KY 42103',        '2705550113', 'santos.dumont@email.com',             'service'),
('Carmen Miranda',       '330 Sunset Blvd, Bowling Green, KY 42104',      '2705550114', 'carmen.miranda@email.com',           'purchase'),
('Vinicius de Moraes',     '88 Lakewood Cir, Bowling Green, KY 42101',      '2705550115', 'vinicius.moraes@email.com',         'service'),
('Tarsila do Amaral',     '512 Birchwood Dr, Bowling Green, KY 42103',     '2705550116', 'tarsila.amaral@email.com',         'visit'),
('Machado de Assis',      '19 Cedar Point Rd, Bowling Green, KY 42104',    '2705550117', 'machado.assis@email.com',          'purchase');

-- Vehicles: 10 with realistic VINs (17-char), mix of statuses
INSERT INTO Vehicle (VIN, Make, Model, Year, Price, Status, Motor_W, Max_Speed, Range_Km, Battery) VALUES
('1HGCM82633A004856', 'Yadea', 'GFX6', 2025, 12900.00, 'inventory', 1000, 32, 70, 'Lítio removível'),
('2T1BURHE0JC043210', 'Yadea', 'GB60', 2025, 7900.00, 'sold', 800, 32, 55, 'Lítio removível'),
('3VWFE21C04M000991', 'Yadea', 'DT3', 2025, 9900.00, 'inventory', 1000, 32, 60, 'Lítio'),
('5YJSA1DN5DFP09834', 'Évee', 'S20', 2025, 11500.00, 'leased', 1000, 32, 50, 'Lítio'),
('1FTFW1ET5DFC08321', 'Yadea', 'M6-H', 2025, 10900.00, 'in_service', 1000, 32, 71, 'Lítio removível'),
('WBAVA33576KS09812', 'Évee', 'D50', 2025, 9500.00, 'inventory', 1000, 32, 50, 'Lítio removível'),
('1G1ZT53806F100876', 'Yadea', 'Owin', 2025, 9900.00, 'sold', 1000, 32, 70, 'Lítio'),
('JH4KA7650MC019834', 'Évee', 'Classic Q8', 2025, 8500.00, 'inventory', 800, 32, 40, 'Lítio'),
('1N4AL3AP2DC100293', 'Motochefe', 'X12', 2025, 10500.00, 'in_service', 1000, 32, 50, 'Lítio 60V 20Ah removível'),
('KMHCN46C28U100847', 'Évee', 'F10', 2025, 6500.00, 'inventory', 800, 32, 50, 'Lítio'),
('19XFC2F59GE001234', 'Évee', 'Iron D01', 2025, 9900.00, 'sold', 1000, 32, 50, 'Lítio removível'),
('3FA6P0H7XGR100456', 'Évee', 'Flash', 2025, 11000.00, 'inventory', 1000, 32, 60, 'Lítio removível'),
('9EV0000000000X015', 'Évee', 'Tractor X15', 2025, 12000.00, 'inventory', 1000, 32, 50, 'Lítio removível'),
('9LT000000000MIA01', 'Litoral', 'Triciclo Mia', 2025, 11900.00, 'inventory', 800, 32, 55, 'Lítio'),
('9EV000000000TRI01', 'Évee', 'Triciclo Tri', 2025, 13500.00, 'inventory', 1000, 32, 50, 'Lítio'),
('9VS000000000TRI02', 'Vanshida', 'Triciclo', 2025, 12500.00, 'inventory', 800, 32, 55, 'Lítio 60V 20Ah'),
('9EV000000000TUK01', 'Évee', 'Tuktuk 01', 2025, 16900.00, 'inventory', 800, 32, 60, 'Lítio 60V 20Ah'),
('9LT000000000PAT01', 'Litoral', 'Patinete c/ Assento', 2025, 3500.00, 'inventory', 800, 32, 35, 'Lítio'),
('9LT000000000PAT02', 'Litoral', 'Patinete Elétrico', 2025, 2500.00, 'inventory', 350, 30, 25, 'Lítio');

-- Inventory: all non-sold, non-in_service vehicles
INSERT INTO Inventory (VIN, `Location`) VALUES
('1HGCM82633A004856', 'main_lot'),
('3VWFE21C04M000991', 'main_lot'),
('5YJSA1DN5DFP09834', 'other_dealership'),
('WBAVA33576KS09812', 'remote_lot'),
('JH4KA7650MC019834', 'in_transit'),
('KMHCN46C28U100847', 'main_lot'),
('3FA6P0H7XGR100456', 'main_lot');

-- Service records: mix of completed and in-progress
INSERT INTO Service (VIN, C_ID, Start_Mileage, End_Mileage, Estimated_Cost, Work_Performed, Final_Cost) VALUES
-- Completed
('1FTFW1ET5DFC08321', 1, 45200, 45205, 350.00, 'Oil change, brake inspection, tire rotation',             320.00),
('2T1BURHE0JC043210', 4, 33100, 33102, 150.00, 'Diagnostic scan and battery replacement',                 165.00),
('WBAVA33576KS09812', 4, 61000, 61003, 500.00, 'Transmission fluid flush and filter change',              480.00),
('1HGCM82633A004856', 1, 12000, 12001, 200.00, 'AC recharge and cabin filter replacement',                200.00),
('2T1BURHE0JC043210', 6, 38500, 38504, 275.00, 'Front brake pads and rotors replaced',                    290.00),
('KMHCN46C28U100847', 3, 72000, 72003, 120.00, 'Spark plug replacement and throttle body cleaning',       115.00),
('3FA6P0H7XGR100456', 5, 54300, 54305, 420.00, 'Timing belt replacement and coolant flush',               445.00),
('JH4KA7650MC019834', 8, 18200, 18201, 180.00, 'Wiper blades, cabin filter, and tire pressure check',     175.00),
-- In Progress (no End_Mileage, no Final_Cost)
('1N4AL3AP2DC100293', 7, 62400, NULL,  380.00, NULL, NULL),
('WBAVA33576KS09812', 1, 65100, NULL,  650.00, NULL, NULL),
('1FTFW1ET5DFC08321', 9, 48900, NULL,  220.00, NULL, NULL);

-- ServiceEmployee assignments
INSERT INTO ServiceEmployee (Serv_ID, E_ID) VALUES
(1, 2), (1, 4),
(2, 4),
(3, 2),
(4, 4),
(5, 6),
(6, 2),
(7, 4), (7, 6),
(8, 2),
(9, 2), (9, 4),
(10, 6),
(11, 4);

-- Sales: 5 transactions
INSERT INTO Sales (VIN, C_ID, Temp_Tag, Date, Customization) VALUES
('2T1BURHE0JC043210', 3,  'TMP-20240301-001', '2024-03-01', 'Window tinting'),
('1G1ZT53806F100876', 2,  'TMP-20240315-002', '2024-03-15', NULL),
('5YJSA1DN5DFP09834', 5,  'TMP-20240401-003', '2024-04-01', 'Paint protection film, floor mats'),
('19XFC2F59GE001234', 10, 'TMP-20240520-004', '2024-05-20', 'Remote start, tinted windows'),
('1G1ZT53806F100876', 6,  'TMP-20240610-005', '2024-06-10', NULL);

-- Billing: sale and service records
INSERT INTO Billing (Sale_ID, Serv_ID, C_ID, Payment_Method, Date) VALUES
(1,    NULL, 3,  'financing', '2024-03-01'),
(2,    NULL, 2,  'credit',    '2024-03-15'),
(3,    NULL, 5,  'financing', '2024-04-01'),
(4,    NULL, 10, 'cash',      '2024-05-20'),
(5,    NULL, 6,  'debit',     '2024-06-10'),
(NULL, 1,    1,  'cash',      '2024-03-10'),
(NULL, 2,    4,  'debit',     '2024-02-20'),
(NULL, 3,    4,  'credit',    '2024-04-05'),
(NULL, 4,    1,  'check',     '2024-04-18'),
(NULL, 5,    6,  'financing', '2024-05-01'),
(NULL, 6,    3,  'credit',    '2024-05-15'),
(NULL, 7,    5,  'cash',      '2024-06-01'),
(NULL, 8,    8,  'debit',     '2024-06-20');

-- ═══════════════════════════════════════════════════════════════════════
-- Dados Celore DMS (peças de moto elétrica, fornecedores, usuários, etc.)
-- ═══════════════════════════════════════════════════════════════════════

INSERT INTO AppUser (Employee_ID, Username, Password_Hash, Role, Active) VALUES
(NULL, 'igor.bernardino',   '$2b$10$koqSPCFzxxp/EByUrtpmq.CSfCCWtDrQ/9tuE0NWqCA30UhAzaopC', 'admin', TRUE),
(NULL, 'julia.guerino',     '$2b$10$koqSPCFzxxp/EByUrtpmq.CSfCCWtDrQ/9tuE0NWqCA30UhAzaopC', 'admin', TRUE),
(NULL, 'lucas.bomfim',      '$2b$10$koqSPCFzxxp/EByUrtpmq.CSfCCWtDrQ/9tuE0NWqCA30UhAzaopC', 'admin', TRUE),
(NULL, 'rikelmy.costa',     '$2b$10$koqSPCFzxxp/EByUrtpmq.CSfCCWtDrQ/9tuE0NWqCA30UhAzaopC', 'admin', TRUE),
(NULL, 'vinicius.ferreira', '$2b$10$koqSPCFzxxp/EByUrtpmq.CSfCCWtDrQ/9tuE0NWqCA30UhAzaopC', 'admin', TRUE),
(NULL, 'lucas.rozario',     '$2b$10$koqSPCFzxxp/EByUrtpmq.CSfCCWtDrQ/9tuE0NWqCA30UhAzaopC', 'admin', TRUE);

-- Atalhos fixados por usuário (Function_Key = id da função no front).
INSERT INTO UserFavorite (User_ID, Function_Key, Position) VALUES
(1, 'os', 0), (1, 'rev', 1), (1, 'pecas', 2), (1, 'orc', 3), (1, 'cal', 4), (1, 'fin', 5);

-- ═══ Fornecedores ═══════════════════════════════════════════════════════════
INSERT INTO Supplier (Name, CNPJ, Address, P_Number, Email) VALUES
('VoltParts Distribuidora Ltda',        '12.345.678/0001-90', 'Av. das Indústrias, 1200 - São Paulo, SP', '1133224455', 'vendas@voltparts.com.br'),
('MotoElétrica Comércio de Peças',      '98.765.432/0001-10', 'Rua do Comércio, 340 - Santos, SP',        '1332114466', 'comercial@motoeletrica.com.br'),
('PowerCell Baterias do Brasil S.A.',   '45.678.912/0001-33', 'Rod. Anchieta, km 20 - Cubatão, SP',       '1338877665', 'contato@powercell.com.br');

-- ═══ Catálogo de peças (moto elétrica) ══════════════════════════════════════
-- Part_ID segue a ordem: 1=Bateria ... 15=Chave de ignição
INSERT INTO Part (Code, Description, Category, Unit, Sale_Price, Min_Stock) VALUES
('BAT-6020',   'Bateria 60V 20Ah Lítio',          'Baterias',    'un',  2450.00,  3),
('CAR-603',    'Carregador 60V 3A',               'Elétrica',    'un',   320.00,  4),
('CTR-60',     'Controlador 60V 1500W',           'Elétrica',    'un',   480.00,  3),
('MOT-1500',   'Motor cubo traseiro 1500W',       'Motor',       'un',  1350.00,  2),
('PNE-D9012',  'Pneu dianteiro 90/90-12',         'Pneus',       'un',   180.00,  6),
('PNE-T10012', 'Pneu traseiro 100/90-12',         'Pneus',       'un',   210.00,  6),
('CAM-12',     'Câmara de ar aro 12"',            'Pneus',       'un',    35.00, 10),
('RET-PAR',    'Retrovisor (par)',                'Acessórios',  'par',   95.00,  5),
('GUI-AL',     'Guidão de alumínio',              'Chassi',      'un',   160.00,  4),
('MAN-ACL',    'Manopla aceleradora',             'Elétrica',    'un',   140.00,  5),
('FAR-LED',    'Farol dianteiro LED',             'Iluminação',  'un',   220.00,  5),
('PIS-LED',    'Pisca/seta LED (par)',            'Iluminação',  'par',   60.00,  8),
('PAS-FRE',    'Pastilha de freio (par)',         'Freios',      'par',   75.00, 10),
('DIS-LCD',    'Display/painel LCD',              'Elétrica',    'un',   380.00,  3),
('CHV-IGN',    'Chave de ignição',                'Elétrica',    'un',    90.00,  6);

-- ═══ Compras (pedido de compra + itens) ═════════════════════════════════════
INSERT INTO PurchaseOrder (Supplier_ID, Order_Date, Status, Total) VALUES
(1, '2026-06-10', 'received', 10940.00),   -- PO 1: baterias + carregadores
(3, '2026-07-05', 'sent',      3400.00);   -- PO 2: pneus

INSERT INTO PurchaseOrderItem (PO_ID, Part_ID, Quantity, Unit_Cost) VALUES
(1, 1, 5, 1900.00),   -- 5 baterias
(1, 2, 6,  240.00),   -- 6 carregadores
(2, 5, 10, 130.00),   -- 10 pneus dianteiros
(2, 6, 10, 150.00);   -- 10 pneus traseiros

-- ═══ Movimentação de estoque (livro-razão) ══════════════════════════════════
-- Quantity ASSINADA: entrada (+), saída (−). Saldo = SUM(Quantity).
-- Entradas iniciais de estoque:
INSERT INTO StockMovement (Part_ID, Type, Quantity, Unit_Cost, Origin, Reference_ID, Movement_Date, Note) VALUES
( 1, 'in',  8, 1900.00, 'purchase',    1, '2026-06-10 09:00:00', 'Entrada NF compra - baterias'),
( 2, 'in', 12,  240.00, 'purchase',    1, '2026-06-10 09:00:00', 'Entrada NF compra - carregadores'),
( 3, 'in',  6,  360.00, 'adjustment',  NULL, '2026-06-01 08:00:00', 'Contagem inicial'),
( 4, 'in',  4, 1000.00, 'adjustment',  NULL, '2026-06-01 08:00:00', 'Contagem inicial'),
( 5, 'in', 20,  130.00, 'purchase',    2, '2026-07-08 10:00:00', 'Entrada NF compra - pneus D'),
( 6, 'in', 20,  150.00, 'purchase',    2, '2026-07-08 10:00:00', 'Entrada NF compra - pneus T'),
( 7, 'in', 40,   22.00, 'adjustment',  NULL, '2026-06-01 08:00:00', 'Contagem inicial'),
( 8, 'in', 15,   62.00, 'adjustment',  NULL, '2026-06-01 08:00:00', 'Contagem inicial'),
( 9, 'in', 10,  110.00, 'adjustment',  NULL, '2026-06-01 08:00:00', 'Contagem inicial'),
(10, 'in', 12,   95.00, 'adjustment',  NULL, '2026-06-01 08:00:00', 'Contagem inicial'),
(11, 'in', 14,  150.00, 'adjustment',  NULL, '2026-06-01 08:00:00', 'Contagem inicial'),
(12, 'in', 25,   38.00, 'adjustment',  NULL, '2026-06-01 08:00:00', 'Contagem inicial'),
(13, 'in', 30,   48.00, 'adjustment',  NULL, '2026-06-01 08:00:00', 'Contagem inicial'),
(14, 'in',  8,  260.00, 'adjustment',  NULL, '2026-06-01 08:00:00', 'Contagem inicial'),
(15, 'in', 18,   58.00, 'adjustment',  NULL, '2026-06-01 08:00:00', 'Contagem inicial');

-- Saídas por serviço/venda e ajustes:
INSERT INTO StockMovement (Part_ID, Type, Quantity, Unit_Cost, Origin, Reference_ID, Movement_Date, Note) VALUES
(13, 'out', -2, NULL, 'service', 1, '2026-07-12 11:00:00', 'Pastilhas usadas na OS #1'),
( 1, 'out', -1, NULL, 'service', 2, '2026-07-15 14:00:00', 'Bateria trocada na OS #2'),
(13, 'out', -2, NULL, 'service', 5, '2026-07-20 09:30:00', 'Pastilhas usadas na OS #5'),
( 5, 'out', -1, NULL, 'service', 5, '2026-07-20 09:30:00', 'Pneu dianteiro na OS #5'),
(11, 'out', -1, NULL, 'service', 4, '2026-07-22 16:00:00', 'Farol trocado na OS #4'),
( 7, 'out', -3, NULL, 'service', 7, '2026-07-25 10:00:00', 'Câmaras usadas na OS #7'),
( 8, 'out', -1, NULL, 'sale',    NULL, '2026-08-02 13:00:00', 'Venda de balcão - retrovisor'),
( 7, 'adjust', -2, NULL, 'adjustment', NULL, '2026-08-05 17:00:00', 'Perda por avaria');

-- ═══ Peças aplicadas em Ordens de Serviço ═══════════════════════════════════
INSERT INTO ServicePart (Serv_ID, Part_ID, Quantity, Unit_Price) VALUES
(1, 13, 2,   75.00),
(2,  1, 1, 2450.00),
(5, 13, 2,   75.00),
(5,  5, 1,  180.00),
(7,  7, 3,   35.00),
(4, 11, 1,  220.00);

-- ═══ Requisições internas de peças ══════════════════════════════════════════
INSERT INTO Requisition (Employee_ID, Serv_ID, Req_Date, Status) VALUES
(2,  9, '2026-08-20', 'open'),        -- Raaj, OS em andamento
(4, 10, '2026-08-22', 'fulfilled');   -- Mike

INSERT INTO RequisitionItem (Req_ID, Part_ID, Quantity) VALUES
(1,  1, 1),
(1, 10, 1),
(2, 13, 2);

-- ═══ Agendamentos ═══════════════════════════════════════════════════════════
INSERT INTO Appointment (C_ID, VIN, Employee_ID, Scheduled_For, Reason, Status) VALUES
(1, '1FTFW1ET5DFC08321', 2, '2026-09-02 09:00:00', 'Revisão de 1.000 km',   'scheduled'),
(6, '2T1BURHE0JC043210', 4, '2026-09-03 14:30:00', 'Troca de bateria',       'scheduled'),
(3, 'KMHCN46C28U100847', 6, '2026-08-28 10:00:00', 'Diagnóstico elétrico',   'done'),
(9, '1N4AL3AP2DC100293', 2, '2026-09-05 11:00:00', 'Barulho no freio',       'scheduled');

-- ═══ Revisões programadas ═══════════════════════════════════════════════════
INSERT INTO Revision (VIN, Serv_ID, Plan_Mileage, Due_Date, Status) VALUES
('1FTFW1ET5DFC08321', NULL, 1000, '2026-09-02', 'pending'),
('2T1BURHE0JC043210', 2,    5000, '2026-07-15', 'done'),
('KMHCN46C28U100847', NULL, 1000, '2026-08-01', 'overdue');

-- ═══ Garantias ══════════════════════════════════════════════════════════════
INSERT INTO Warranty (Coverage, VIN, Part_ID, Serv_ID, Start_Date, End_Date, Terms) VALUES
('part',    NULL,               1,    NULL, '2026-06-10', '2027-06-10', 'Garantia de 12 meses para bateria de lítio'),
('vehicle', '5YJSA1DN5DFP09834', NULL, NULL, '2026-01-15', '2028-01-15', 'Garantia de fábrica de 24 meses'),
('service', NULL,               NULL, 5,    '2026-07-20', '2026-10-18', 'Garantia de 90 dias do serviço realizado');

-- ═══ Orçamentos ═════════════════════════════════════════════════════════════
INSERT INTO Quote (C_ID, VIN, Type, Quote_Date, Valid_Until, Total, Status) VALUES
(5, '1HGCM82633A004856', 'sale',    '2026-08-15', '2026-08-30', 28500.00, 'open'),
(7, '1N4AL3AP2DC100293', 'service', '2026-08-18', '2026-09-01',   620.00, 'approved');

-- ═══ Reservas ═══════════════════════════════════════════════════════════════
INSERT INTO Reservation (VIN, C_ID, Reserved_At, Expires_At, Status) VALUES
('3VWFE21C04M000991',  5, '2026-08-20 10:00:00', '2026-08-27 10:00:00', 'active'),
('JH4KA7650MC019834', 10, '2026-08-10 15:00:00', '2026-08-17 15:00:00', 'expired');

-- ═══ Notas fiscais ══════════════════════════════════════════════════════════
INSERT INTO Invoice (Number, Kind, Sale_ID, Serv_ID, PO_ID, Issue_Date, Total, XML_Imported) VALUES
('35240300000000000000000000000000000000000001', 'sale',     1,    NULL, NULL, '2024-03-01', 22000.00, FALSE),
('35240400000000000000000000000000000000000002', 'sale',     3,    NULL, NULL, '2024-04-01', 89000.00, FALSE),
('35240300000000000000000000000000000000000003', 'service',  NULL, 1,    NULL, '2024-03-10',   320.00, FALSE),
('35260600000000000000000000000000000000000004', 'purchase', NULL, NULL, 1,    '2026-06-10', 10940.00, TRUE);

-- ═══ Lançamentos financeiros (contas a pagar/receber) ═══════════════════════
INSERT INTO AccountEntry (Direction, C_ID, Supplier_ID, Invoice_ID, Amount, Due_Date, Paid_Date, Status) VALUES
('receivable', 3,    NULL, 1,    22000.00, '2024-04-01', '2024-04-01', 'paid'),
('receivable', 5,    NULL, 2,    89000.00, '2024-05-01', NULL,         'open'),
('receivable', 1,    NULL, 3,      320.00, '2024-03-20', '2024-03-18', 'paid'),
('payable',    NULL, 1,    4,    10940.00, '2026-07-10', NULL,         'open'),
('payable',    NULL, 3,    NULL,  2800.00, '2026-08-10', NULL,         'overdue');

-- ═══ Status das Ordens de Serviço já existentes (pipeline da oficina) ════════
UPDATE Service SET Status = 'faturada'        WHERE Service_ID BETWEEN 1 AND 8;
UPDATE Service SET Status = 'em_reparo'       WHERE Service_ID = 9;
UPDATE Service SET Status = 'aguardando_peca' WHERE Service_ID = 10;
UPDATE Service SET Status = 'aberta'          WHERE Service_ID = 11;

-- ═══ Estoque de Veículos (entradas de lote e saídas por venda) ═══════════
INSERT INTO VehicleMovement (Make, Model, Type, Quantity, Unit_Cost, Movement_Date, Note) VALUES
('Yadea', 'GB60', 'in', 8, 6200.00, '2026-06-05 09:00:00', 'Entrada de lote'),
('Yadea', 'GB60', 'out', -3, NULL, '2026-07-10 14:00:00', 'Vendas do mês'),
('Yadea', 'DT3', 'in', 6, 7800.00, '2026-06-05 09:00:00', 'Entrada de lote'),
('Yadea', 'DT3', 'out', -2, NULL, '2026-07-12 11:00:00', 'Vendas do mês'),
('Yadea', 'M6-H', 'in', 5, 8600.00, '2026-06-10 09:00:00', 'Entrada de lote'),
('Yadea', 'GFX6', 'in', 4, 10200.00, '2026-06-10 09:00:00', 'Entrada de lote'),
('Yadea', 'GFX6', 'out', -1, NULL, '2026-07-20 16:00:00', 'Venda'),
('Yadea', 'Owin', 'in', 5, 7600.00, '2026-06-12 09:00:00', 'Entrada de lote'),
('Yadea', 'Owin', 'out', -2, NULL, '2026-07-22 10:00:00', 'Vendas'),
('Évee', 'S20', 'in', 4, 9000.00, '2026-06-15 09:00:00', 'Entrada de lote'),
('Évee', 'D50', 'in', 6, 7400.00, '2026-06-15 09:00:00', 'Entrada de lote'),
('Évee', 'D50', 'out', -1, NULL, '2026-07-25 15:00:00', 'Venda'),
('Évee', 'Classic Q8', 'in', 5, 6600.00, '2026-06-18 09:00:00', 'Entrada de lote'),
('Évee', 'F10', 'in', 10, 5100.00, '2026-06-18 09:00:00', 'Entrada de lote'),
('Évee', 'F10', 'out', -4, NULL, '2026-07-28 12:00:00', 'Vendas'),
('Évee', 'Iron D01', 'in', 4, 7700.00, '2026-06-20 09:00:00', 'Entrada de lote'),
('Évee', 'Flash', 'in', 3, 8600.00, '2026-06-20 09:00:00', 'Entrada de lote'),
('Évee', 'Tractor X15', 'in', 3, 9400.00, '2026-06-22 09:00:00', 'Entrada de lote'),
('Motochefe', 'X12', 'in', 4, 8200.00, '2026-06-22 09:00:00', 'Entrada de lote'),
('Motochefe', 'X12', 'out', -1, NULL, '2026-08-01 10:00:00', 'Venda'),
('Litoral', 'Triciclo Mia', 'in', 3, 9300.00, '2026-06-25 09:00:00', 'Entrada de lote'),
('Évee', 'Triciclo Tri', 'in', 2, 10600.00, '2026-06-25 09:00:00', 'Entrada de lote'),
('Vanshida', 'Triciclo', 'in', 3, 9800.00, '2026-06-25 09:00:00', 'Entrada de lote'),
('Évee', 'Tuktuk 01', 'in', 2, 13200.00, '2026-06-28 09:00:00', 'Entrada de lote'),
('Litoral', 'Patinete c/ Assento', 'in', 12, 2600.00, '2026-06-28 09:00:00', 'Entrada de lote'),
('Litoral', 'Patinete c/ Assento', 'out', -5, NULL, '2026-08-02 11:00:00', 'Vendas'),
('Litoral', 'Patinete Elétrico', 'in', 15, 1800.00, '2026-06-28 09:00:00', 'Entrada de lote'),
('Litoral', 'Patinete Elétrico', 'out', -6, NULL, '2026-08-03 11:00:00', 'Vendas');

-- Data de abertura das Ordens de Serviço (para relatórios por período)
UPDATE Service SET Opened_Date = '2026-06-12' WHERE Service_ID = 1;
UPDATE Service SET Opened_Date = '2026-06-20' WHERE Service_ID = 2;
UPDATE Service SET Opened_Date = '2026-07-01' WHERE Service_ID = 3;
UPDATE Service SET Opened_Date = '2026-07-05' WHERE Service_ID = 4;
UPDATE Service SET Opened_Date = '2026-07-12' WHERE Service_ID = 5;
UPDATE Service SET Opened_Date = '2026-07-18' WHERE Service_ID = 6;
UPDATE Service SET Opened_Date = '2026-07-25' WHERE Service_ID = 7;
UPDATE Service SET Opened_Date = '2026-08-02' WHERE Service_ID = 8;
UPDATE Service SET Opened_Date = '2026-08-15' WHERE Service_ID = 9;
UPDATE Service SET Opened_Date = '2026-08-20' WHERE Service_ID = 10;
UPDATE Service SET Opened_Date = '2026-08-28' WHERE Service_ID = 11;
