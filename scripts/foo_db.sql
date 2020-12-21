USE [foo_db]
GO
/****** Object:  UserDefinedTableType [dbo].[EmployeeType]    Script Date: 9/2/2020 2:15:47 AM ******/
CREATE TYPE [dbo].[EmployeeType] AS TABLE(
	[Code] [varchar](50) NOT NULL,
	[Name] [varchar](50) NULL,
	[Job] [varchar](50) NULL,
	[Salary] [int] NULL,
	[Department] [varchar](50) NULL
)
GO
/****** Object:  Table [dbo].[User]    Script Date: 9/2/2020 8:06:47 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[User](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[UserName] [varchar](50) NULL,
	[Password] [varchar](20) NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Employee]    Script Date: 9/2/2020 2:15:47 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Employee](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Code] [varchar](50) NOT NULL,
	[Name] [varchar](50) NULL,
	[Job] [varchar](50) NULL,
	[Salary] [int] NULL,
	[Department] [varchar](50) NULL,
 CONSTRAINT [PK_Employee] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[users]    Script Date: 9/2/2020 2:15:47 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[users](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[firstName] [nvarchar](255) NOT NULL,
	[lastName] [nvarchar](255) NULL,
	[createdAt] [datetimeoffset](7) NOT NULL,
	[updatedAt] [datetimeoffset](7) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
SET IDENTITY_INSERT [dbo].[Employee] ON 

INSERT [dbo].[Employee] ([Id], [Code], [Name], [Job], [Salary], [Department]) VALUES (1, N'CT7207', N'Bently Smith', N'Manager', 40000, N'Operations')
INSERT [dbo].[Employee] ([Id], [Code], [Name], [Job], [Salary], [Department]) VALUES (2, N'CT7210', N'Isla Morris', N'Director', 80000, N'Operations')
INSERT [dbo].[Employee] ([Id], [Code], [Name], [Job], [Salary], [Department]) VALUES (3, N'CT7202', N'Allen Green', N'Salesman', 15000, N'Sales')
INSERT [dbo].[Employee] ([Id], [Code], [Name], [Job], [Salary], [Department]) VALUES (4, N'CT7208', N'Xavier Campbell', N'Analyst', 50000, N'Research')
INSERT [dbo].[Employee] ([Id], [Code], [Name], [Job], [Salary], [Department]) VALUES (5, N'CT7209', N'Ethan Kumar', N'Analyst', 50000, N'Research')
INSERT [dbo].[Employee] ([Id], [Code], [Name], [Job], [Salary], [Department]) VALUES (6, N'CT7201', N'John Marshal', N'Clerk', 20000, N'Accounting')
INSERT [dbo].[Employee] ([Id], [Code], [Name], [Job], [Salary], [Department]) VALUES (7, N'CT7205', N'Ethan Almaas', N'Salesman', 15000, N'Sales')
INSERT [dbo].[Employee] ([Id], [Code], [Name], [Job], [Salary], [Department]) VALUES (8, N'CT7211', N'Natalie Robinson', N'Salesman', 15000, N'Sales')
INSERT [dbo].[Employee] ([Id], [Code], [Name], [Job], [Salary], [Department]) VALUES (9, N'CT7212', N'Earl Rose', N'Salesman', 15000, N'Sales')
INSERT [dbo].[Employee] ([Id], [Code], [Name], [Job], [Salary], [Department]) VALUES (10, N'CT7206', N'Ilija Seifert', N'Clerk', 20000, N'Accounting')
INSERT [dbo].[Employee] ([Id], [Code], [Name], [Job], [Salary], [Department]) VALUES (11, N'CT7204', N'Annette Burke', N'Clerk', 20000, N'Accounting')
INSERT [dbo].[Employee] ([Id], [Code], [Name], [Job], [Salary], [Department]) VALUES (12, N'CT7203', N'Fernando Gordon', N'Salesman', 15000, N'Sales')
INSERT [dbo].[Employee] ([Id], [Code], [Name], [Job], [Salary], [Department]) VALUES (13, N'CT7213', N'Catherine Foster', N'Salesman', 15000, N'Sales')
INSERT [dbo].[Employee] ([Id], [Code], [Name], [Job], [Salary], [Department]) VALUES (14, N'CT7207', N'Josh', N'Manager', 40000, N'Operations')
INSERT [dbo].[Employee] ([Id], [Code], [Name], [Job], [Salary], [Department]) VALUES (15, N'CT7207', N'Paul', N'Manager', 40000, N'Operations')
INSERT [dbo].[Employee] ([Id], [Code], [Name], [Job], [Salary], [Department]) VALUES (18, N'CT7207', N'Jim Wong', N'Manager', 40000, N'Operations')
INSERT [dbo].[Employee] ([Id], [Code], [Name], [Job], [Salary], [Department]) VALUES (21, N'CT7207', N'Harry Potter', N'Manager', 30000, N'Operations')
INSERT [dbo].[Employee] ([Id], [Code], [Name], [Job], [Salary], [Department]) VALUES (23, N'CT7207', N'Tony Stark', N'Manager', 20000, N'Operations')
INSERT [dbo].[Employee] ([Id], [Code], [Name], [Job], [Salary], [Department]) VALUES (24, N'CT7207', N'Steve Rogers', N'Manager', 20000, N'Operations')
INSERT [dbo].[Employee] ([Id], [Code], [Name], [Job], [Salary], [Department]) VALUES (25, N'CT7547', N'Tom Holland', N'Manager', 20000, N'Operations')
SET IDENTITY_INSERT [dbo].[Employee] OFF
SET IDENTITY_INSERT [dbo].[users] ON 

INSERT [dbo].[users] ([id], [firstName], [lastName], [createdAt], [updatedAt]) VALUES (1, N'John', N'Doe', CAST(N'2020-05-14T09:51:55.1640000+00:00' AS DateTimeOffset), CAST(N'2020-05-14T09:51:55.1640000+00:00' AS DateTimeOffset))
SET IDENTITY_INSERT [dbo].[users] OFF
/****** Object:  StoredProcedure [dbo].[AddEmployees]    Script Date: 9/2/2020 2:15:47 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Zaki Mohammed
-- Create date: 1:18 AM 9/2/2020
-- Description:	Insert multiple-employees
-- =============================================
CREATE PROCEDURE [dbo].[AddEmployees]
	@Employees EmployeeType READONLY
AS
BEGIN
	DECLARE @lastId INT;

	SET @lastId = (SELECT MAX(Id) AS LastId FROM Employee);

	INSERT INTO Employee (Code, [Name], Job, Salary, Department)
	SELECT * FROM @Employees;

	SELECT * FROM Employee WHERE Id > @lastId;
END
GO
/****** Object:  StoredProcedure [dbo].[GetEmployeeByDepartment]    Script Date: 9/2/2020 2:15:47 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Zaki Mohammed
-- Create date: 7:46 PM 5/13/2020
-- Description:	Get employee salary summary
-- =============================================
CREATE PROCEDURE [dbo].[GetEmployeeByDepartment]
	@Department VARCHAR(100)
AS
BEGIN
	SELECT * FROM Employee WHERE Department = @Department ORDER BY Name;
END
GO
/****** Object:  StoredProcedure [dbo].[GetEmployeeByJob]    Script Date: 9/2/2020 2:15:47 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Zaki Mohammed
-- Create date: 7:46 PM 5/13/2020
-- Description:	Get employee salary summary
-- =============================================
CREATE PROCEDURE [dbo].[GetEmployeeByJob]
	@Job VARCHAR(100)
AS
BEGIN
	SELECT * FROM Employee WHERE Job = @Job ORDER BY Name;
END
GO
/****** Object:  StoredProcedure [dbo].[GetEmployeesStatus]    Script Date: 9/2/2020 2:15:47 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Zaki Mohammed
-- Create date: 1:44 AM 9/2/2020
-- Description:	Get employee records current status
-- =============================================
CREATE PROCEDURE [dbo].[GetEmployeesStatus]
	@Count		INT OUTPUT,
	@Max		INT OUTPUT,
	@Min		INT OUTPUT,
	@Average	INT OUTPUT,
	@Sum		INT OUTPUT
AS
BEGIN
	SELECT
		@Count		= (SELECT COUNT(1)		FROM Employee),
		@Max		= (SELECT MAX(Salary)	FROM Employee),
		@Min		= (SELECT MIN(Salary)	FROM Employee),
		@Average	= (SELECT AVG(Salary)	FROM Employee),
		@Sum		= (SELECT SUM(Salary)	FROM Employee);
END
GO
/****** Object:  StoredProcedure [dbo].[GetSalarySummary]    Script Date: 9/2/2020 2:15:47 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Zaki Mohammed
-- Create date: 7:46 PM 5/13/2020
-- Description:	Get salary summary
-- =============================================
CREATE PROCEDURE [dbo].[GetSalarySummary]
AS
BEGIN
	-- get department wise salary summary
	SELECT	
		Department, 
		COUNT(1) EmployeeCount, 
		SUM(Salary) AS Salary, 
		SUM(Salary) * 12 AS Annual
	FROM 
		Employee 
	GROUP BY 
		Department 
	ORDER BY
		SUM(Salary) DESC;

	-- get job wise salary summary
	SELECT
		Job, 
		COUNT(1) EmployeeCount, 
		SUM(Salary) AS Salary, 
		SUM(Salary) * 12 AS Annual 
	FROM 
		Employee 
	GROUP BY 
		Job 
	ORDER BY 
		SUM(Salary) DESC;
END
GO
/****** Object:  StoredProcedure [dbo].[SearchEmployee]    Script Date: 9/2/2020 2:15:47 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Zaki Mohammed
-- Create date: 8:05 PM 5/13/2020
-- Description:	Search employee by name
-- =============================================
CREATE PROCEDURE [dbo].[SearchEmployee]
	@Name VARCHAR(100)
AS
BEGIN
	SELECT * FROM Employee WHERE LOWER(Name) LIKE '%' + LOWER(@Name) + '%'
END
GO
/****** Object:  StoredProcedure [dbo].[AuthenticateUser]    Script Date: 9/2/2020 2:15:47 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Zaki Mohammed
-- Create date: 9:03 PM 9/2/2020
-- Description:	Authenticate user
-- =============================================
CREATE PROCEDURE [dbo].[AuthenticateUser]
	@UserName VARCHAR(50),
	@Password VARCHAR(20)
AS
BEGIN
	SELECT * FROM [User] WHERE UserName = @UserName AND [Password] = @Password;
END
GO