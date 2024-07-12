USE [master]
GO
/****** Object:  Database [CoffeBarManagementData]    Script Date: 5/28/2024 11:25:24 AM ******/
CREATE DATABASE [CoffeBarManagementData]
 CONTAINMENT = NONE
 ON  PRIMARY 
( NAME = N'CoffeBarManagementData_Data', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL16.SQLEXPRESS\MSSQL\DATA\CoffeBarManagementData.mdf' , SIZE = 8192KB , MAXSIZE = UNLIMITED, FILEGROWTH = 1024KB )
 LOG ON 
( NAME = N'CoffeBarManagementData_Log', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL16.SQLEXPRESS\MSSQL\DATA\CoffeBarManagementData.ldf' , SIZE = 8192KB , MAXSIZE = 2048GB , FILEGROWTH = 10%)
 WITH CATALOG_COLLATION = DATABASE_DEFAULT, LEDGER = OFF
GO
ALTER DATABASE [CoffeBarManagementData] SET COMPATIBILITY_LEVEL = 160
GO
IF (1 = FULLTEXTSERVICEPROPERTY('IsFullTextInstalled'))
begin
EXEC [CoffeBarManagementData].[dbo].[sp_fulltext_database] @action = 'enable'
end
GO
ALTER DATABASE [CoffeBarManagementData] SET ANSI_NULL_DEFAULT OFF 
GO
ALTER DATABASE [CoffeBarManagementData] SET ANSI_NULLS OFF 
GO
ALTER DATABASE [CoffeBarManagementData] SET ANSI_PADDING OFF 
GO
ALTER DATABASE [CoffeBarManagementData] SET ANSI_WARNINGS OFF 
GO
ALTER DATABASE [CoffeBarManagementData] SET ARITHABORT OFF 
GO
ALTER DATABASE [CoffeBarManagementData] SET AUTO_CLOSE OFF 
GO
ALTER DATABASE [CoffeBarManagementData] SET AUTO_SHRINK OFF 
GO
ALTER DATABASE [CoffeBarManagementData] SET AUTO_UPDATE_STATISTICS ON 
GO
ALTER DATABASE [CoffeBarManagementData] SET CURSOR_CLOSE_ON_COMMIT OFF 
GO
ALTER DATABASE [CoffeBarManagementData] SET CURSOR_DEFAULT  GLOBAL 
GO
ALTER DATABASE [CoffeBarManagementData] SET CONCAT_NULL_YIELDS_NULL OFF 
GO
ALTER DATABASE [CoffeBarManagementData] SET NUMERIC_ROUNDABORT OFF 
GO
ALTER DATABASE [CoffeBarManagementData] SET QUOTED_IDENTIFIER OFF 
GO
ALTER DATABASE [CoffeBarManagementData] SET RECURSIVE_TRIGGERS OFF 
GO
ALTER DATABASE [CoffeBarManagementData] SET  DISABLE_BROKER 
GO
ALTER DATABASE [CoffeBarManagementData] SET AUTO_UPDATE_STATISTICS_ASYNC OFF 
GO
ALTER DATABASE [CoffeBarManagementData] SET DATE_CORRELATION_OPTIMIZATION OFF 
GO
ALTER DATABASE [CoffeBarManagementData] SET TRUSTWORTHY OFF 
GO
ALTER DATABASE [CoffeBarManagementData] SET ALLOW_SNAPSHOT_ISOLATION OFF 
GO
ALTER DATABASE [CoffeBarManagementData] SET PARAMETERIZATION SIMPLE 
GO
ALTER DATABASE [CoffeBarManagementData] SET READ_COMMITTED_SNAPSHOT OFF 
GO
ALTER DATABASE [CoffeBarManagementData] SET HONOR_BROKER_PRIORITY OFF 
GO
ALTER DATABASE [CoffeBarManagementData] SET RECOVERY SIMPLE 
GO
ALTER DATABASE [CoffeBarManagementData] SET  MULTI_USER 
GO
ALTER DATABASE [CoffeBarManagementData] SET PAGE_VERIFY CHECKSUM  
GO
ALTER DATABASE [CoffeBarManagementData] SET DB_CHAINING OFF 
GO
ALTER DATABASE [CoffeBarManagementData] SET FILESTREAM( NON_TRANSACTED_ACCESS = OFF ) 
GO
ALTER DATABASE [CoffeBarManagementData] SET TARGET_RECOVERY_TIME = 60 SECONDS 
GO
ALTER DATABASE [CoffeBarManagementData] SET DELAYED_DURABILITY = DISABLED 
GO
ALTER DATABASE [CoffeBarManagementData] SET ACCELERATED_DATABASE_RECOVERY = OFF  
GO
ALTER DATABASE [CoffeBarManagementData] SET QUERY_STORE = ON
GO
ALTER DATABASE [CoffeBarManagementData] SET QUERY_STORE (OPERATION_MODE = READ_WRITE, CLEANUP_POLICY = (STALE_QUERY_THRESHOLD_DAYS = 30), DATA_FLUSH_INTERVAL_SECONDS = 900, INTERVAL_LENGTH_MINUTES = 60, MAX_STORAGE_SIZE_MB = 1000, QUERY_CAPTURE_MODE = AUTO, SIZE_BASED_CLEANUP_MODE = AUTO, MAX_PLANS_PER_QUERY = 200, WAIT_STATS_CAPTURE_MODE = ON)
GO
USE [CoffeBarManagementData]
GO
/****** Object:  User [app]    Script Date: 5/28/2024 11:25:24 AM ******/
CREATE USER [app] FOR LOGIN [app] WITH DEFAULT_SCHEMA=[dbo]
GO
ALTER ROLE [db_owner] ADD MEMBER [app]
GO
ALTER ROLE [db_accessadmin] ADD MEMBER [app]
GO
ALTER ROLE [db_securityadmin] ADD MEMBER [app]
GO
ALTER ROLE [db_ddladmin] ADD MEMBER [app]
GO
ALTER ROLE [db_backupoperator] ADD MEMBER [app]
GO
ALTER ROLE [db_datareader] ADD MEMBER [app]
GO
ALTER ROLE [db_datawriter] ADD MEMBER [app]
GO
ALTER ROLE [db_denydatareader] ADD MEMBER [app]
GO
ALTER ROLE [db_denydatawriter] ADD MEMBER [app]
GO
/****** Object:  Table [dbo].[__EFMigrationsHistory]    Script Date: 5/28/2024 11:25:24 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[__EFMigrationsHistory](
	[MigrationId] [nvarchar](150) NOT NULL,
	[ProductVersion] [nvarchar](32) NOT NULL,
 CONSTRAINT [PK___EFMigrationsHistory] PRIMARY KEY CLUSTERED 
(
	[MigrationId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Category]    Script Date: 5/28/2024 11:25:24 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Category](
	[category_Id] [int] IDENTITY(1,1) NOT NULL,
	[category_Name] [varchar](50) NULL,
PRIMARY KEY CLUSTERED 
(
	[category_Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Clients]    Script Date: 5/28/2024 11:25:24 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Clients](
	[client_Id] [int] IDENTITY(1,1) NOT NULL,
	[firstName] [varchar](50) NULL,
	[lastName] [varchar](50) NULL,
	[email] [varchar](100) NULL,
	[userId] [varchar](100) NULL,
	[phone_number] [varchar](15) NULL,
PRIMARY KEY CLUSTERED 
(
	[client_Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Complex_Products_Components]    Script Date: 5/28/2024 11:25:24 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Complex_Products_Components](
	[cpc_Id] [int] IDENTITY(1,1) NOT NULL,
	[target_product_Id] [int] NULL,
	[component_product_Id] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[cpc_Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Employee]    Script Date: 5/28/2024 11:25:24 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Employee](
	[employee_Id] [int] IDENTITY(1,1) NOT NULL,
	[firstName] [varchar](50) NULL,
	[lastName] [varchar](50) NULL,
	[email] [varchar](100) NULL,
	[salary] [float] NULL,
	[userId] [varchar](100) NULL,
PRIMARY KEY CLUSTERED 
(
	[employee_Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Order_products]    Script Date: 5/28/2024 11:25:24 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Order_products](
	[order_products_Id] [int] IDENTITY(1,1) NOT NULL,
	[order_Id] [int] NOT NULL,
	[product_Id] [int] NULL,
	[unit_Price] [float] NULL,
	[quantity] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[order_products_Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Orders]    Script Date: 5/28/2024 11:25:24 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Orders](
	[order_Id] [int] IDENTITY(1,1) NOT NULL,
	[order_date] [datetime] NULL,
	[order_status] [int] NULL,
	[client_Id] [int] NULL,
	[employee_Id] [int] NULL,
	[table_Id] [int] NULL,
	[tips] [float] NULL,
PRIMARY KEY CLUSTERED 
(
	[order_Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Organization]    Script Date: 5/28/2024 11:25:24 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Organization](
	[organization_Id] [int] IDENTITY(1,1) NOT NULL,
	[Name] [varchar](100) NULL,
	[Address] [varchar](100) NULL,
	[Logo_Path] [varchar](100) NULL,
	[openStatus] [bit] NULL,
PRIMARY KEY CLUSTERED 
(
	[organization_Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Products]    Script Date: 5/28/2024 11:25:24 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Products](
	[product_Id] [int] IDENTITY(1,1) NOT NULL,
	[Name] [varchar](50) NULL,
	[unit_price] [float] NULL,
	[unit_measure] [varchar](10) NULL,
	[availableForUser] [bit] NULL,
	[complex_product] [bit] NULL,
	[category_Id] [int] NULL,
	[quantity] [int] NULL,
	[supplyCheck] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[product_Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Remove_Category]    Script Date: 5/28/2024 11:25:24 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Remove_Category](
	[remove_category_Id] [int] IDENTITY(1,1) NOT NULL,
	[remove_category_Name] [varchar](20) NULL,
PRIMARY KEY CLUSTERED 
(
	[remove_category_Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Reservations]    Script Date: 5/28/2024 11:25:24 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Reservations](
	[reservation_Id] [int] IDENTITY(1,1) NOT NULL,
	[reservation_Date] [datetime] NOT NULL,
	[guest_Number] [int] NOT NULL,
	[reservation_Status] [bit] NULL,
	[duration] [int] NULL,
	[client_Id] [int] NULL,
	[table_Id] [int] NULL,
	[firstName] [varchar](50) NULL,
	[lastName] [varchar](50) NULL,
	[phoneNumber] [varchar](50) NULL,
PRIMARY KEY CLUSTERED 
(
	[reservation_Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Stock_Balance]    Script Date: 5/28/2024 11:25:24 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Stock_Balance](
	[stock_balance_Id] [int] IDENTITY(1,1) NOT NULL,
	[balance_date] [datetime] NULL,
	[product_Id] [int] NULL,
	[remove_quantity] [int] NULL,
	[remove_category_Id] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[stock_balance_Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Tables]    Script Date: 5/28/2024 11:25:24 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Tables](
	[table_Id] [int] IDENTITY(1,1) NOT NULL,
	[capacity] [int] NULL,
	[table_status] [bit] NULL,
PRIMARY KEY CLUSTERED 
(
	[table_Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
INSERT [dbo].[__EFMigrationsHistory] ([MigrationId], [ProductVersion]) VALUES (N'20240401094306_AddNewColumnsToReservation', N'8.0.3')
GO
SET IDENTITY_INSERT [dbo].[Category] ON 

INSERT [dbo].[Category] ([category_Id], [category_Name]) VALUES (1, N'Alc drinks')
INSERT [dbo].[Category] ([category_Id], [category_Name]) VALUES (2, N'bevreges')
INSERT [dbo].[Category] ([category_Id], [category_Name]) VALUES (3, N'coffe')
INSERT [dbo].[Category] ([category_Id], [category_Name]) VALUES (4, N'lactate')
INSERT [dbo].[Category] ([category_Id], [category_Name]) VALUES (5, N'bakery')
SET IDENTITY_INSERT [dbo].[Category] OFF
GO
SET IDENTITY_INSERT [dbo].[Clients] ON 

INSERT [dbo].[Clients] ([client_Id], [firstName], [lastName], [email], [userId], [phone_number]) VALUES (2, N'radu', N'ciuperca', N'radu@gmail.com', N'63faeab9-0a7e-4d61-ac81-90a1e74bfcad', N'0786661664')
INSERT [dbo].[Clients] ([client_Id], [firstName], [lastName], [email], [userId], [phone_number]) VALUES (3, N'sorina', N'damaschin', N'sorina@gmail.com', N'ca29bbe9-8c73-46e8-98ad-78d11aa318b9', N'0786661664')
INSERT [dbo].[Clients] ([client_Id], [firstName], [lastName], [email], [userId], [phone_number]) VALUES (4, N'iulian', N'boss', N'iublian@gmail.com', N'b801fecd-b754-4874-b89c-0ea11809694b', N'07777777777')
INSERT [dbo].[Clients] ([client_Id], [firstName], [lastName], [email], [userId], [phone_number]) VALUES (5, N'porojan', N'boss', N'porojan@gmail.com', N'f60bf7be-fb81-4d77-83d4-9e36c2c9be44', N'07777777777')
INSERT [dbo].[Clients] ([client_Id], [firstName], [lastName], [email], [userId], [phone_number]) VALUES (7, N'cian', N'jackson', N'cian@gmail.com', N'403e3c94-5bd4-4881-8f66-a53836faf2ea', N'+40786661773')
INSERT [dbo].[Clients] ([client_Id], [firstName], [lastName], [email], [userId], [phone_number]) VALUES (8, N'iulian', N'ionel', N'ionel@gmail.com', N'b7a65b60-0576-42c7-a813-a4efb8870829', N'+40786661668')
INSERT [dbo].[Clients] ([client_Id], [firstName], [lastName], [email], [userId], [phone_number]) VALUES (9, N'iuliana', N'museteanu', N'iuliana@gmail.com', N'f31b3ff3-2fc1-432a-8153-bcea525fcc4d', N'+40756664663')
INSERT [dbo].[Clients] ([client_Id], [firstName], [lastName], [email], [userId], [phone_number]) VALUES (10, N'adriana', N'museteanu', N'adriana@gmail.com', N'82e3b57c-facf-429c-9c11-fba58d62f9ef', N'+40786664773')
INSERT [dbo].[Clients] ([client_Id], [firstName], [lastName], [email], [userId], [phone_number]) VALUES (11, N'jhon', N'jhonson', N'jhonny@gmail.com', N'e98f9b6d-923a-42cd-9328-8d1f910b496a', N'+40748884883')
INSERT [dbo].[Clients] ([client_Id], [firstName], [lastName], [email], [userId], [phone_number]) VALUES (12, N'mariana', N'ciobanu', N'ciobanu@gmail.com', N'73da505e-df49-419f-bf78-99ba34e2c5bb', N'+40847773882')
INSERT [dbo].[Clients] ([client_Id], [firstName], [lastName], [email], [userId], [phone_number]) VALUES (13, N'sorinica', N'damaschin', N'sorinica@gmail.com', N'46c96ae1-7d7b-478c-99d3-859ea0a9481d', N'+40758884388')
INSERT [dbo].[Clients] ([client_Id], [firstName], [lastName], [email], [userId], [phone_number]) VALUES (14, N'iulian', N'cheoseaua', N'cheoseaua@gmail.com', N'2aa90326-c0ad-4b4d-a171-14e2c2d71aaf', N'+40798883774')
INSERT [dbo].[Clients] ([client_Id], [firstName], [lastName], [email], [userId], [phone_number]) VALUES (15, N'savu', N'stoica', N'stoica@gmail.com', N'c914afd0-88f2-46c8-baa3-99f520273365', N'+40758474773')
INSERT [dbo].[Clients] ([client_Id], [firstName], [lastName], [email], [userId], [phone_number]) VALUES (16, N'client1', N'client', N'client1@gmail.com', N'e3122272-8708-4e5c-bc89-67c8fbb73c4e', N'+40787774332')
INSERT [dbo].[Clients] ([client_Id], [firstName], [lastName], [email], [userId], [phone_number]) VALUES (17, N'cian123', N'jackson', N'cian123@gmail.com', N'20c57d72-8955-41cb-b713-be7c33d34255', N'+40786661773')
SET IDENTITY_INSERT [dbo].[Clients] OFF
GO
SET IDENTITY_INSERT [dbo].[Complex_Products_Components] ON 

INSERT [dbo].[Complex_Products_Components] ([cpc_Id], [target_product_Id], [component_product_Id]) VALUES (1, 6, 2)
INSERT [dbo].[Complex_Products_Components] ([cpc_Id], [target_product_Id], [component_product_Id]) VALUES (2, 6, 3)
INSERT [dbo].[Complex_Products_Components] ([cpc_Id], [target_product_Id], [component_product_Id]) VALUES (6, 8, 2)
INSERT [dbo].[Complex_Products_Components] ([cpc_Id], [target_product_Id], [component_product_Id]) VALUES (7, 8, 3)
INSERT [dbo].[Complex_Products_Components] ([cpc_Id], [target_product_Id], [component_product_Id]) VALUES (12, 17, 2)
INSERT [dbo].[Complex_Products_Components] ([cpc_Id], [target_product_Id], [component_product_Id]) VALUES (13, 20, 2)
INSERT [dbo].[Complex_Products_Components] ([cpc_Id], [target_product_Id], [component_product_Id]) VALUES (14, 20, 18)
INSERT [dbo].[Complex_Products_Components] ([cpc_Id], [target_product_Id], [component_product_Id]) VALUES (15, 20, 19)
SET IDENTITY_INSERT [dbo].[Complex_Products_Components] OFF
GO
SET IDENTITY_INSERT [dbo].[Employee] ON 

INSERT [dbo].[Employee] ([employee_Id], [firstName], [lastName], [email], [salary], [userId]) VALUES (1, N'employee1', N'first', N'first@gmail.com', 1000.23, N'988cd22e-e17c-4f57-b08c-bb6117bd7f1b')
INSERT [dbo].[Employee] ([employee_Id], [firstName], [lastName], [email], [salary], [userId]) VALUES (2, N'jhonsonemployee', N'second', N'secont@gmail.com', 2000.23, N'b4482560-2489-4efa-8fd1-9e901b50cd9c')
SET IDENTITY_INSERT [dbo].[Employee] OFF
GO
SET IDENTITY_INSERT [dbo].[Order_products] ON 

INSERT [dbo].[Order_products] ([order_products_Id], [order_Id], [product_Id], [unit_Price], [quantity]) VALUES (84, 40, 1, 2.99, 1)
SET IDENTITY_INSERT [dbo].[Order_products] OFF
GO
SET IDENTITY_INSERT [dbo].[Orders] ON 

INSERT [dbo].[Orders] ([order_Id], [order_date], [order_status], [client_Id], [employee_Id], [table_Id], [tips]) VALUES (40, CAST(N'2024-05-09T22:24:02.267' AS DateTime), 2, 2, 1, 3, 0)
SET IDENTITY_INSERT [dbo].[Orders] OFF
GO
SET IDENTITY_INSERT [dbo].[Products] ON 

INSERT [dbo].[Products] ([product_Id], [Name], [unit_price], [unit_measure], [availableForUser], [complex_product], [category_Id], [quantity], [supplyCheck]) VALUES (1, N'cola330ml', 2.99, N'piece', 1, 0, 2, 7, 20)
INSERT [dbo].[Products] ([product_Id], [Name], [unit_price], [unit_measure], [availableForUser], [complex_product], [category_Id], [quantity], [supplyCheck]) VALUES (2, N'arabiccoffe', 0, N'bag', 0, 0, 3, 20, 2)
INSERT [dbo].[Products] ([product_Id], [Name], [unit_price], [unit_measure], [availableForUser], [complex_product], [category_Id], [quantity], [supplyCheck]) VALUES (3, N'milk', 0, N'pack', 0, 0, 4, 20, 5)
INSERT [dbo].[Products] ([product_Id], [Name], [unit_price], [unit_measure], [availableForUser], [complex_product], [category_Id], [quantity], [supplyCheck]) VALUES (6, N'cappucino', 2.5, N'cup', 1, 1, 3, 0, 0)
INSERT [dbo].[Products] ([product_Id], [Name], [unit_price], [unit_measure], [availableForUser], [complex_product], [category_Id], [quantity], [supplyCheck]) VALUES (8, N'macchiato', 1.5, N'cup', 1, 1, 3, 0, 0)
INSERT [dbo].[Products] ([product_Id], [Name], [unit_price], [unit_measure], [availableForUser], [complex_product], [category_Id], [quantity], [supplyCheck]) VALUES (14, N'pepsi0.5l', 1.79, N'bottle', 1, 0, 2, 20, 15)
INSERT [dbo].[Products] ([product_Id], [Name], [unit_price], [unit_measure], [availableForUser], [complex_product], [category_Id], [quantity], [supplyCheck]) VALUES (15, N'croissant', 1.99, N'piece', 1, 0, 5, 60, 10)
INSERT [dbo].[Products] ([product_Id], [Name], [unit_price], [unit_measure], [availableForUser], [complex_product], [category_Id], [quantity], [supplyCheck]) VALUES (16, N'lemonade0.5', 2.49, N'bottle', 1, 0, 2, 50, 15)
INSERT [dbo].[Products] ([product_Id], [Name], [unit_price], [unit_measure], [availableForUser], [complex_product], [category_Id], [quantity], [supplyCheck]) VALUES (17, N'espresso', 1.3, N'cup', 1, 1, 3, 0, 0)
INSERT [dbo].[Products] ([product_Id], [Name], [unit_price], [unit_measure], [availableForUser], [complex_product], [category_Id], [quantity], [supplyCheck]) VALUES (18, N'whipped cream', 0, N'pack', 0, 0, 4, 60, 15)
INSERT [dbo].[Products] ([product_Id], [Name], [unit_price], [unit_measure], [availableForUser], [complex_product], [category_Id], [quantity], [supplyCheck]) VALUES (19, N'irish wisky', 49.99, N'bottle', 1, 0, 1, 50, 3)
INSERT [dbo].[Products] ([product_Id], [Name], [unit_price], [unit_measure], [availableForUser], [complex_product], [category_Id], [quantity], [supplyCheck]) VALUES (20, N'irish coffe', 2.3, N'cup', 1, 1, 3, 0, 0)
SET IDENTITY_INSERT [dbo].[Products] OFF
GO
SET IDENTITY_INSERT [dbo].[Remove_Category] ON 

INSERT [dbo].[Remove_Category] ([remove_category_Id], [remove_category_Name]) VALUES (1, N'automate')
INSERT [dbo].[Remove_Category] ([remove_category_Id], [remove_category_Name]) VALUES (2, N'manual')
INSERT [dbo].[Remove_Category] ([remove_category_Id], [remove_category_Name]) VALUES (3, N'waste')
SET IDENTITY_INSERT [dbo].[Remove_Category] OFF
GO
SET IDENTITY_INSERT [dbo].[Reservations] ON 

INSERT [dbo].[Reservations] ([reservation_Id], [reservation_Date], [guest_Number], [reservation_Status], [duration], [client_Id], [table_Id], [firstName], [lastName], [phoneNumber]) VALUES (31, CAST(N'2024-04-25T12:00:00.000' AS DateTime), 1, 0, 1, 2, 1, N'radu', N'ciuperca', N'0786661664')
INSERT [dbo].[Reservations] ([reservation_Id], [reservation_Date], [guest_Number], [reservation_Status], [duration], [client_Id], [table_Id], [firstName], [lastName], [phoneNumber]) VALUES (32, CAST(N'2024-04-25T12:00:00.000' AS DateTime), 1, 0, 1, 2, 2, N'radu', N'ciuperca', N'0786661664')
INSERT [dbo].[Reservations] ([reservation_Id], [reservation_Date], [guest_Number], [reservation_Status], [duration], [client_Id], [table_Id], [firstName], [lastName], [phoneNumber]) VALUES (33, CAST(N'2024-04-25T10:55:00.000' AS DateTime), 1, 0, 1, 2, 1, N'radu', N'ciuperca', N'0786661664')
INSERT [dbo].[Reservations] ([reservation_Id], [reservation_Date], [guest_Number], [reservation_Status], [duration], [client_Id], [table_Id], [firstName], [lastName], [phoneNumber]) VALUES (34, CAST(N'2024-04-25T13:05:00.000' AS DateTime), 1, 0, 1, 2, 1, N'radu', N'ciuperca', N'0786661664')
INSERT [dbo].[Reservations] ([reservation_Id], [reservation_Date], [guest_Number], [reservation_Status], [duration], [client_Id], [table_Id], [firstName], [lastName], [phoneNumber]) VALUES (35, CAST(N'2024-04-25T23:00:00.000' AS DateTime), 1, 0, 2, 2, 1, N'radu', N'ciuperca', N'0786661664')
INSERT [dbo].[Reservations] ([reservation_Id], [reservation_Date], [guest_Number], [reservation_Status], [duration], [client_Id], [table_Id], [firstName], [lastName], [phoneNumber]) VALUES (36, CAST(N'2024-04-26T07:00:00.000' AS DateTime), 1, 0, 1, 2, 1, N'radu', N'ciuperca', N'0786661664')
INSERT [dbo].[Reservations] ([reservation_Id], [reservation_Date], [guest_Number], [reservation_Status], [duration], [client_Id], [table_Id], [firstName], [lastName], [phoneNumber]) VALUES (37, CAST(N'2024-04-28T07:00:00.000' AS DateTime), 1, 0, 1, 2, 10, N'radu', N'ciuperca', N'0786661664')
INSERT [dbo].[Reservations] ([reservation_Id], [reservation_Date], [guest_Number], [reservation_Status], [duration], [client_Id], [table_Id], [firstName], [lastName], [phoneNumber]) VALUES (38, CAST(N'2024-05-02T12:12:00.000' AS DateTime), 1, 0, 2, 2, 5, N'radu', N'ciuperca', N'0786661664')
INSERT [dbo].[Reservations] ([reservation_Id], [reservation_Date], [guest_Number], [reservation_Status], [duration], [client_Id], [table_Id], [firstName], [lastName], [phoneNumber]) VALUES (39, CAST(N'2024-04-25T11:11:00.000' AS DateTime), 1, 0, 1, 2, 10, N'radu', N'ciuperca', N'0786661664')
INSERT [dbo].[Reservations] ([reservation_Id], [reservation_Date], [guest_Number], [reservation_Status], [duration], [client_Id], [table_Id], [firstName], [lastName], [phoneNumber]) VALUES (40, CAST(N'2024-04-29T12:22:00.000' AS DateTime), 1, 0, 1, 2, 1, N'radu', N'ciuperca', N'0786661664')
INSERT [dbo].[Reservations] ([reservation_Id], [reservation_Date], [guest_Number], [reservation_Status], [duration], [client_Id], [table_Id], [firstName], [lastName], [phoneNumber]) VALUES (41, CAST(N'2024-04-01T19:54:00.000' AS DateTime), 6, 1, 1, NULL, 6, N'Client', N'WithoutAccount', N'0786661553')
INSERT [dbo].[Reservations] ([reservation_Id], [reservation_Date], [guest_Number], [reservation_Status], [duration], [client_Id], [table_Id], [firstName], [lastName], [phoneNumber]) VALUES (42, CAST(N'2024-05-01T19:54:00.000' AS DateTime), 6, 0, 1, NULL, 6, N'Client', N'WithoutAccount', N'0786661553')
INSERT [dbo].[Reservations] ([reservation_Id], [reservation_Date], [guest_Number], [reservation_Status], [duration], [client_Id], [table_Id], [firstName], [lastName], [phoneNumber]) VALUES (43, CAST(N'2024-05-04T19:54:00.000' AS DateTime), 6, 0, 1, NULL, 6, N'Client', N'WithoutAccount', N'0786661553')
INSERT [dbo].[Reservations] ([reservation_Id], [reservation_Date], [guest_Number], [reservation_Status], [duration], [client_Id], [table_Id], [firstName], [lastName], [phoneNumber]) VALUES (46, CAST(N'2024-05-13T08:00:00.000' AS DateTime), 10, 1, 14, NULL, 2, N'Client12', N'Client12', N'+40784459332')
INSERT [dbo].[Reservations] ([reservation_Id], [reservation_Date], [guest_Number], [reservation_Status], [duration], [client_Id], [table_Id], [firstName], [lastName], [phoneNumber]) VALUES (47, CAST(N'2024-05-28T02:49:00.000' AS DateTime), 1, 1, 1, NULL, 9, N'asdas', N'dasdasd', N'+40783994003')
INSERT [dbo].[Reservations] ([reservation_Id], [reservation_Date], [guest_Number], [reservation_Status], [duration], [client_Id], [table_Id], [firstName], [lastName], [phoneNumber]) VALUES (48, CAST(N'2024-05-21T15:50:00.000' AS DateTime), 4, 1, 1, 2, 3, N'radu', N'ciuperca', N'0786661664')
INSERT [dbo].[Reservations] ([reservation_Id], [reservation_Date], [guest_Number], [reservation_Status], [duration], [client_Id], [table_Id], [firstName], [lastName], [phoneNumber]) VALUES (49, CAST(N'2024-05-07T12:30:00.000' AS DateTime), 3, 1, 1, 2, 9, N'radu', N'ciuperca', N'0786661664')
INSERT [dbo].[Reservations] ([reservation_Id], [reservation_Date], [guest_Number], [reservation_Status], [duration], [client_Id], [table_Id], [firstName], [lastName], [phoneNumber]) VALUES (50, CAST(N'2024-05-06T20:00:00.000' AS DateTime), 1, 1, 1, 2, 2, N'radu', N'ciuperca', N'0786661664')
INSERT [dbo].[Reservations] ([reservation_Id], [reservation_Date], [guest_Number], [reservation_Status], [duration], [client_Id], [table_Id], [firstName], [lastName], [phoneNumber]) VALUES (51, CAST(N'2024-05-07T14:00:00.000' AS DateTime), 3, 1, 1, 2, 2, N'radu', N'ciuperca', N'0786661664')
SET IDENTITY_INSERT [dbo].[Reservations] OFF
GO
SET IDENTITY_INSERT [dbo].[Stock_Balance] ON 

INSERT [dbo].[Stock_Balance] ([stock_balance_Id], [balance_date], [product_Id], [remove_quantity], [remove_category_Id]) VALUES (68, CAST(N'2024-05-09T21:34:03.423' AS DateTime), 19, 1, 1)
INSERT [dbo].[Stock_Balance] ([stock_balance_Id], [balance_date], [product_Id], [remove_quantity], [remove_category_Id]) VALUES (69, CAST(N'2024-05-09T21:34:27.860' AS DateTime), 14, 2, 1)
INSERT [dbo].[Stock_Balance] ([stock_balance_Id], [balance_date], [product_Id], [remove_quantity], [remove_category_Id]) VALUES (70, CAST(N'2024-05-09T21:34:38.530' AS DateTime), 1, 2, 1)
INSERT [dbo].[Stock_Balance] ([stock_balance_Id], [balance_date], [product_Id], [remove_quantity], [remove_category_Id]) VALUES (71, CAST(N'2024-05-09T21:37:45.453' AS DateTime), 16, 1, 1)
INSERT [dbo].[Stock_Balance] ([stock_balance_Id], [balance_date], [product_Id], [remove_quantity], [remove_category_Id]) VALUES (72, CAST(N'2024-05-09T21:38:49.170' AS DateTime), 14, 1, 1)
INSERT [dbo].[Stock_Balance] ([stock_balance_Id], [balance_date], [product_Id], [remove_quantity], [remove_category_Id]) VALUES (73, CAST(N'2024-05-09T21:38:49.180' AS DateTime), 16, 1, 1)
INSERT [dbo].[Stock_Balance] ([stock_balance_Id], [balance_date], [product_Id], [remove_quantity], [remove_category_Id]) VALUES (74, CAST(N'2024-05-09T21:40:29.283' AS DateTime), 1, 1, 1)
INSERT [dbo].[Stock_Balance] ([stock_balance_Id], [balance_date], [product_Id], [remove_quantity], [remove_category_Id]) VALUES (75, CAST(N'2024-05-09T21:55:40.313' AS DateTime), 1, 2, 1)
INSERT [dbo].[Stock_Balance] ([stock_balance_Id], [balance_date], [product_Id], [remove_quantity], [remove_category_Id]) VALUES (76, CAST(N'2024-05-09T22:11:39.273' AS DateTime), 1, 2, 1)
INSERT [dbo].[Stock_Balance] ([stock_balance_Id], [balance_date], [product_Id], [remove_quantity], [remove_category_Id]) VALUES (77, CAST(N'2024-05-09T22:11:39.363' AS DateTime), 14, 1, 1)
INSERT [dbo].[Stock_Balance] ([stock_balance_Id], [balance_date], [product_Id], [remove_quantity], [remove_category_Id]) VALUES (78, CAST(N'2024-05-09T22:24:02.433' AS DateTime), 1, 1, 1)
INSERT [dbo].[Stock_Balance] ([stock_balance_Id], [balance_date], [product_Id], [remove_quantity], [remove_category_Id]) VALUES (79, CAST(N'2024-05-27T13:32:00.823' AS DateTime), 1, 1, 1)
SET IDENTITY_INSERT [dbo].[Stock_Balance] OFF
GO
SET IDENTITY_INSERT [dbo].[Tables] ON 

INSERT [dbo].[Tables] ([table_Id], [capacity], [table_status]) VALUES (1, 6, 0)
INSERT [dbo].[Tables] ([table_Id], [capacity], [table_status]) VALUES (2, 10, 0)
INSERT [dbo].[Tables] ([table_Id], [capacity], [table_status]) VALUES (3, 4, 1)
INSERT [dbo].[Tables] ([table_Id], [capacity], [table_status]) VALUES (4, 4, 0)
INSERT [dbo].[Tables] ([table_Id], [capacity], [table_status]) VALUES (5, 6, 0)
INSERT [dbo].[Tables] ([table_Id], [capacity], [table_status]) VALUES (6, 6, 0)
INSERT [dbo].[Tables] ([table_Id], [capacity], [table_status]) VALUES (7, 6, 0)
INSERT [dbo].[Tables] ([table_Id], [capacity], [table_status]) VALUES (8, 6, 0)
INSERT [dbo].[Tables] ([table_Id], [capacity], [table_status]) VALUES (9, 4, 0)
INSERT [dbo].[Tables] ([table_Id], [capacity], [table_status]) VALUES (10, 4, 0)
SET IDENTITY_INSERT [dbo].[Tables] OFF
GO
ALTER TABLE [dbo].[Complex_Products_Components] ADD  DEFAULT (NULL) FOR [target_product_Id]
GO
ALTER TABLE [dbo].[Complex_Products_Components] ADD  DEFAULT (NULL) FOR [component_product_Id]
GO
ALTER TABLE [dbo].[Employee] ADD  DEFAULT (NULL) FOR [firstName]
GO
ALTER TABLE [dbo].[Employee] ADD  DEFAULT (NULL) FOR [lastName]
GO
ALTER TABLE [dbo].[Employee] ADD  DEFAULT (NULL) FOR [salary]
GO
ALTER TABLE [dbo].[Order_products] ADD  DEFAULT (NULL) FOR [product_Id]
GO
ALTER TABLE [dbo].[Orders] ADD  DEFAULT (NULL) FOR [order_date]
GO
ALTER TABLE [dbo].[Orders] ADD  DEFAULT ((1)) FOR [order_status]
GO
ALTER TABLE [dbo].[Products] ADD  DEFAULT (NULL) FOR [Name]
GO
ALTER TABLE [dbo].[Products] ADD  DEFAULT (NULL) FOR [unit_price]
GO
ALTER TABLE [dbo].[Reservations] ADD  DEFAULT (NULL) FOR [firstName]
GO
ALTER TABLE [dbo].[Reservations] ADD  DEFAULT (NULL) FOR [lastName]
GO
ALTER TABLE [dbo].[Reservations] ADD  DEFAULT (NULL) FOR [phoneNumber]
GO
ALTER TABLE [dbo].[Complex_Products_Components]  WITH CHECK ADD FOREIGN KEY([component_product_Id])
REFERENCES [dbo].[Products] ([product_Id])
GO
ALTER TABLE [dbo].[Complex_Products_Components]  WITH CHECK ADD FOREIGN KEY([target_product_Id])
REFERENCES [dbo].[Products] ([product_Id])
GO
ALTER TABLE [dbo].[Order_products]  WITH CHECK ADD FOREIGN KEY([order_Id])
REFERENCES [dbo].[Orders] ([order_Id])
GO
ALTER TABLE [dbo].[Order_products]  WITH CHECK ADD FOREIGN KEY([product_Id])
REFERENCES [dbo].[Products] ([product_Id])
GO
ALTER TABLE [dbo].[Orders]  WITH CHECK ADD FOREIGN KEY([client_Id])
REFERENCES [dbo].[Clients] ([client_Id])
GO
ALTER TABLE [dbo].[Orders]  WITH CHECK ADD FOREIGN KEY([employee_Id])
REFERENCES [dbo].[Employee] ([employee_Id])
GO
ALTER TABLE [dbo].[Orders]  WITH CHECK ADD FOREIGN KEY([table_Id])
REFERENCES [dbo].[Tables] ([table_Id])
GO
ALTER TABLE [dbo].[Products]  WITH CHECK ADD FOREIGN KEY([category_Id])
REFERENCES [dbo].[Category] ([category_Id])
GO
ALTER TABLE [dbo].[Reservations]  WITH CHECK ADD FOREIGN KEY([client_Id])
REFERENCES [dbo].[Clients] ([client_Id])
GO
ALTER TABLE [dbo].[Reservations]  WITH CHECK ADD FOREIGN KEY([table_Id])
REFERENCES [dbo].[Tables] ([table_Id])
GO
ALTER TABLE [dbo].[Stock_Balance]  WITH CHECK ADD FOREIGN KEY([product_Id])
REFERENCES [dbo].[Products] ([product_Id])
GO
ALTER TABLE [dbo].[Stock_Balance]  WITH CHECK ADD FOREIGN KEY([remove_category_Id])
REFERENCES [dbo].[Remove_Category] ([remove_category_Id])
GO
USE [master]
GO
ALTER DATABASE [CoffeBarManagementData] SET  READ_WRITE 
GO
