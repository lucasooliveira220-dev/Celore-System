# Celore DMS

Sistema de gestão para concessionária de **motos elétricas** — um DMS (Dealer Management System) que centraliza estoque de peças, oficina, vendas, clientes e financeiro em uma única aplicação web.

O sistema nasceu da adaptação de um projeto acadêmico de concessionária de veículos e foi remodelado para o contexto de mobilidade elétrica, com identidade visual própria (Celore Tech Solution) e uma arquitetura de banco de dados organizada em módulos.

---

## Funcionalidades

O sistema é organizado em áreas, acessíveis por uma barra lateral com submenus:

- **Início** — painel de atalhos personalizável: cada usuário fixa as funções que mais usa.
- **Estoque** — catálogo de peças com saldo em tempo real, ficha Kardex (extrato de movimentações com saldo acumulado), movimentação de estoque e requisições internas.
- **Oficina** — ordens de serviço com pipeline de status (aberta, aguardando peça, em reparo, pronta, faturada), agendamentos, revisões programadas e garantias.
- **Vendas** — registro de vendas de veículos, com baixa automática do estoque.
- **Clientes** — cadastro de clientes e histórico de relacionamento.
- **Financeiro** — extrato de contas a pagar e receber, e ficha financeira por cliente.
- **Relatórios** — indicadores operacionais em tempo real (estoque, oficina, vendas, peças a repor).
- **Configurações** — usuários do sistema e permissões.
- **Relatórios** — geração de relatórios (Vendas, Serviços, Estoque, Financeiro) por período, com exportação em Excel e PDF.
- **Relatórios** — geração de relatórios (Vendas, Serviços, Estoque, Financeiro) por período, com exportação em Excel e PDF.
- **Login** — autenticação com senha criptografada (bcrypt); os favoritos da tela inicial são individuais por usuário.

---

## Stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS 4** para estilização
- **MySQL 8** como banco de dados
- **mysql2** para acesso ao banco
- **lucide-react** para ícones
- **bcryptjs** (senhas com hash) e **SheetJS/xlsx** (exportação de relatórios)
- **Docker** para orquestrar aplicação + banco

---

## Como rodar

### Pré-requisitos

- Docker Desktop
- Git

### Passos

Clone o repositório e entre na pasta:

```bash
git clone <url-do-repositorio>
cd celore-dms
```

Suba a aplicação:

```bash
docker compose up --build
```

O Docker Compose vai:

1. Construir a aplicação Next.js.
2. Subir o banco MySQL 8.
3. Inicializar o banco automaticamente com o schema e os dados de exemplo.
4. Iniciar a aplicação web assim que o banco estiver pronto.

Quando terminar, acesse:

```
http://localhost:3000
```

O sistema abre na **tela de login**. Use um dos usuários de exemplo (todos administradores):

| Usuário | Senha |
|---|---|
| `igor.bernardino` | `celore123` |
| `julia.guerino` | `celore123` |
| `lucas.bomfim` | `celore123` |
| `rikelmy.costa` | `celore123` |
| `vinicius.ferreira` | `celore123` |
| `lucas.rozario` | `celore123` |

> **Porta:** o banco é exposto na porta `3306` por padrão. Se essa porta já estiver em uso na sua máquina (por exemplo, um MySQL local), ajuste o mapeamento no `docker-compose.yml` (ex.: `3307:3306`) antes de subir.

---

## Comandos úteis

Parar a aplicação, mantendo os dados do banco:

```bash
docker compose down
```

Parar e **apagar o banco** (recomeçar do zero com os dados de exemplo):

```bash
docker compose down -v
docker compose up --build
```

> Use `down -v` sempre que alterar o **schema** ou o **seed** do banco — os arquivos de inicialização só rodam quando o volume do banco é criado do zero.

---

## Estrutura do projeto

```
celore-dms/
├── docker-compose.yml        # Orquestra app + banco, inicializa o SQL
├── Dockerfile                # Build da aplicação Next.js
├── sql/
│   ├── schema.sql            # Estrutura do banco (tabelas + views)
│   ├── seed.sql              # Dados de exemplo
│   ├── reset.sql             # Reconstrói o banco do zero (uso manual)
│   └── queries.sql           # Consultas de referência
└── src/
    ├── app/
    │   ├── (dms)/            # Telas do sistema (com a barra lateral)
    │   │   ├── page.tsx      # Início (atalhos)
    │   │   ├── estoque/      # Estoque e Kardex
    │   │   ├── oficina/      # Ordens de serviço
    │   │   └── ...           # Demais telas
    │   ├── api/              # Rotas de API (endpoints do backend)
    │   ├── layout.tsx        # Layout raiz
    │   └── globals.css       # Tema Celore (identidade laranja)
    ├── components/
    │   ├── dms/              # Componentes do sistema (Sidebar, Topbar...)
    │   └── ui/               # Componentes de UI reutilizáveis
    └── lib/
        └── db.ts             # Conexão com o banco (pool MySQL)
```

---

## Arquitetura do banco de dados

O banco é organizado em módulos, com **25 tabelas** e **8 views** (relatórios derivados, sem duplicar dados):

| Módulo | Tabelas principais |
|---|---|
| **Cadastros** | `Customer`, `Employee`, `Vehicle`, `Inventory`, `Supplier` |
| **Peças & Estoque** | `Part`, `StockMovement`, `PurchaseOrder`, `Requisition` |
| **Oficina & Pós-vendas** | `Service`, `ServicePart`, `Appointment`, `Revision`, `Warranty` |
| **Comercial** | `Sales`, `Quote`, `Reservation` |
| **Fiscal & Financeiro** | `Billing`, `Invoice`, `AccountEntry` |
| **Sistema** | `AppUser`, `UserFavorite` |

### Conceitos de modelagem

- **Estoque como livro-razão** — cada entrada, saída ou ajuste é um registro em `StockMovement`. O saldo de uma peça nunca é gravado fixo: é sempre a soma dos movimentos (view `PartStock`). A ficha Kardex (view `KardexView`) é o extrato desses movimentos com saldo acumulado.
- **Relatórios são views** — Kardex, extrato de contas (`AccountStatement`) e ficha financeira (`CustomerLedger`) são consultas sobre as tabelas de base, não dados duplicados.

---

## Notas

- Os **dados de exemplo** (seed) servem apenas para desenvolvimento e demonstração. Em uso real, seriam substituídos pelos dados cadastrados pelos usuários.
- O sistema possui **autenticação com senha criptografada** (bcrypt) e sessão via cookie. Todos os usuários de exemplo são administradores; a diferenciação de permissões por papel é um próximo passo.
