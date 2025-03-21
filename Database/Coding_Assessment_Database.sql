USE [master]
GO
/****** Object:  Database [Coding_Assessment_Platform]    Script Date: 12/31/2024 8:10:55 PM ******/
CREATE DATABASE [Coding_Assessment_Platform]
 CONTAINMENT = NONE
 ON  PRIMARY 
( NAME = N'Coding_Assessment_Platform', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL16.MSSQLSERVER\MSSQL\DATA\Coding_Assessment_Platform.mdf' , SIZE = 8192KB , MAXSIZE = UNLIMITED, FILEGROWTH = 65536KB )
 LOG ON 
( NAME = N'Coding_Assessment_Platform_log', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL16.MSSQLSERVER\MSSQL\DATA\Coding_Assessment_Platform_log.ldf' , SIZE = 8192KB , MAXSIZE = 2048GB , FILEGROWTH = 65536KB )
 WITH CATALOG_COLLATION = DATABASE_DEFAULT, LEDGER = OFF
GO
ALTER DATABASE [Coding_Assessment_Platform] SET COMPATIBILITY_LEVEL = 160
GO
IF (1 = FULLTEXTSERVICEPROPERTY('IsFullTextInstalled'))
begin
EXEC [Coding_Assessment_Platform].[dbo].[sp_fulltext_database] @action = 'enable'
end
GO
ALTER DATABASE [Coding_Assessment_Platform] SET ANSI_NULL_DEFAULT OFF 
GO
ALTER DATABASE [Coding_Assessment_Platform] SET ANSI_NULLS OFF 
GO
ALTER DATABASE [Coding_Assessment_Platform] SET ANSI_PADDING OFF 
GO
ALTER DATABASE [Coding_Assessment_Platform] SET ANSI_WARNINGS OFF 
GO
ALTER DATABASE [Coding_Assessment_Platform] SET ARITHABORT OFF 
GO
ALTER DATABASE [Coding_Assessment_Platform] SET AUTO_CLOSE OFF 
GO
ALTER DATABASE [Coding_Assessment_Platform] SET AUTO_SHRINK OFF 
GO
ALTER DATABASE [Coding_Assessment_Platform] SET AUTO_UPDATE_STATISTICS ON 
GO
ALTER DATABASE [Coding_Assessment_Platform] SET CURSOR_CLOSE_ON_COMMIT OFF 
GO
ALTER DATABASE [Coding_Assessment_Platform] SET CURSOR_DEFAULT  GLOBAL 
GO
ALTER DATABASE [Coding_Assessment_Platform] SET CONCAT_NULL_YIELDS_NULL OFF 
GO
ALTER DATABASE [Coding_Assessment_Platform] SET NUMERIC_ROUNDABORT OFF 
GO
ALTER DATABASE [Coding_Assessment_Platform] SET QUOTED_IDENTIFIER OFF 
GO
ALTER DATABASE [Coding_Assessment_Platform] SET RECURSIVE_TRIGGERS OFF 
GO
ALTER DATABASE [Coding_Assessment_Platform] SET  DISABLE_BROKER 
GO
ALTER DATABASE [Coding_Assessment_Platform] SET AUTO_UPDATE_STATISTICS_ASYNC OFF 
GO
ALTER DATABASE [Coding_Assessment_Platform] SET DATE_CORRELATION_OPTIMIZATION OFF 
GO
ALTER DATABASE [Coding_Assessment_Platform] SET TRUSTWORTHY OFF 
GO
ALTER DATABASE [Coding_Assessment_Platform] SET ALLOW_SNAPSHOT_ISOLATION OFF 
GO
ALTER DATABASE [Coding_Assessment_Platform] SET PARAMETERIZATION SIMPLE 
GO
ALTER DATABASE [Coding_Assessment_Platform] SET READ_COMMITTED_SNAPSHOT OFF 
GO
ALTER DATABASE [Coding_Assessment_Platform] SET HONOR_BROKER_PRIORITY OFF 
GO
ALTER DATABASE [Coding_Assessment_Platform] SET RECOVERY SIMPLE 
GO
ALTER DATABASE [Coding_Assessment_Platform] SET  MULTI_USER 
GO
ALTER DATABASE [Coding_Assessment_Platform] SET PAGE_VERIFY CHECKSUM  
GO
ALTER DATABASE [Coding_Assessment_Platform] SET DB_CHAINING OFF 
GO
ALTER DATABASE [Coding_Assessment_Platform] SET FILESTREAM( NON_TRANSACTED_ACCESS = OFF ) 
GO
ALTER DATABASE [Coding_Assessment_Platform] SET TARGET_RECOVERY_TIME = 60 SECONDS 
GO
ALTER DATABASE [Coding_Assessment_Platform] SET DELAYED_DURABILITY = DISABLED 
GO
ALTER DATABASE [Coding_Assessment_Platform] SET ACCELERATED_DATABASE_RECOVERY = OFF  
GO
ALTER DATABASE [Coding_Assessment_Platform] SET QUERY_STORE = ON
GO
ALTER DATABASE [Coding_Assessment_Platform] SET QUERY_STORE (OPERATION_MODE = READ_WRITE, CLEANUP_POLICY = (STALE_QUERY_THRESHOLD_DAYS = 30), DATA_FLUSH_INTERVAL_SECONDS = 900, INTERVAL_LENGTH_MINUTES = 60, MAX_STORAGE_SIZE_MB = 1000, QUERY_CAPTURE_MODE = AUTO, SIZE_BASED_CLEANUP_MODE = AUTO, MAX_PLANS_PER_QUERY = 200, WAIT_STATS_CAPTURE_MODE = ON)
GO
USE [Coding_Assessment_Platform]
GO
/****** Object:  User [Ayed]    Script Date: 12/31/2024 8:10:55 PM ******/
CREATE USER [Ayed] FOR LOGIN [Ayed] WITH DEFAULT_SCHEMA=[dbo]
GO
/****** Object:  Table [dbo].[addresses]    Script Date: 12/31/2024 8:10:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[addresses](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[street] [varchar](255) NULL,
	[city] [varchar](255) NULL,
	[state] [varchar](255) NULL,
	[postal_code] [varchar](20) NULL,
	[country] [varchar](255) NULL,
	[created_at] [datetime] NULL,
	[updated_at] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[assessment_assignments]    Script Date: 12/31/2024 8:10:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[assessment_assignments](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[test_id] [int] NULL,
	[candidate_id] [int] NULL,
	[assigned_by] [int] NULL,
	[status_id] [int] NULL,
	[created_at] [datetime] NULL,
	[updated_at] [datetime] NULL,
	[completed_at] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[assessment_statuses]    Script Date: 12/31/2024 8:10:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[assessment_statuses](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[name] [varchar](255) NULL,
	[created_at] [datetime] NULL,
	[updated_at] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
UNIQUE NONCLUSTERED 
(
	[name] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[assessments]    Script Date: 12/31/2024 8:10:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[assessments](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[name] [varchar](255) NULL,
	[created_by] [int] NULL,
	[organization_id] [int] NULL,
	[created_at] [datetime] NULL,
	[updated_at] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[candidates]    Script Date: 12/31/2024 8:10:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[candidates](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[user_id] [int] NULL,
	[profile_details] [text] NULL,
	[created_at] [datetime] NULL,
	[updated_at] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[coding_questions]    Script Date: 12/31/2024 8:10:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[coding_questions](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[question_id] [int] NULL,
	[prompt] [text] NULL,
	[language] [varchar](50) NULL,
	[created_at] [datetime] NULL,
	[updated_at] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
UNIQUE NONCLUSTERED 
(
	[question_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[essay_questions]    Script Date: 12/31/2024 8:10:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[essay_questions](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[question_id] [int] NULL,
	[prompt] [text] NULL,
	[word_limit] [int] NULL,
	[created_at] [datetime] NULL,
	[updated_at] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
UNIQUE NONCLUSTERED 
(
	[question_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[mcq_questions]    Script Date: 12/31/2024 8:10:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[mcq_questions](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[question_id] [int] NULL,
	[prompt] [text] NULL,
	[created_at] [datetime] NULL,
	[updated_at] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
UNIQUE NONCLUSTERED 
(
	[question_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[options]    Script Date: 12/31/2024 8:10:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[options](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[mcq_question_id] [int] NULL,
	[text] [varchar](255) NULL,
	[is_correct] [bit] NULL,
	[created_at] [datetime] NULL,
	[updated_at] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[organization_candidates]    Script Date: 12/31/2024 8:10:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[organization_candidates](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[organization_id] [int] NULL,
	[candidate_id] [int] NULL,
	[created_at] [datetime] NULL,
	[updated_at] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[organizations]    Script Date: 12/31/2024 8:10:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[organizations](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[name] [varchar](255) NULL,
	[address_id] [int] NULL,
	[contact_email] [varchar](255) NULL,
	[subscription_plan_id] [int] NULL,
	[created_at] [datetime] NULL,
	[updated_at] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[questions]    Script Date: 12/31/2024 8:10:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[questions](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[assessment_id] [int] NULL,
	[type] [varchar](50) NULL,
	[max_score] [int] NULL,
	[created_at] [datetime] NULL,
	[updated_at] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[recruiters]    Script Date: 12/31/2024 8:10:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[recruiters](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[user_id] [int] NULL,
	[organization_id] [int] NULL,
	[created_at] [datetime] NULL,
	[updated_at] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[responses]    Script Date: 12/31/2024 8:10:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[responses](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[assignment_id] [int] NULL,
	[question_id] [int] NULL,
	[answer] [text] NULL,
	[score] [int] NULL,
	[created_at] [datetime] NULL,
	[updated_at] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[roles]    Script Date: 12/31/2024 8:10:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[roles](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[name] [varchar](255) NULL,
	[created_at] [datetime] NULL,
	[updated_at] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
UNIQUE NONCLUSTERED 
(
	[name] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[subscription_plans]    Script Date: 12/31/2024 8:10:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[subscription_plans](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[name] [varchar](255) NULL,
	[price] [decimal](10, 2) NULL,
	[features] [text] NULL,
	[duration] [int] NULL,
	[created_at] [datetime] NULL,
	[updated_at] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[users]    Script Date: 12/31/2024 8:10:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[users](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[name] [varchar](255) NULL,
	[email] [varchar](255) NULL,
	[password_hash] [varchar](255) NULL,
	[role_id] [int] NULL,
	[created_at] [datetime] NULL,
	[updated_at] [datetime] NULL,
	[email_verified] [bit] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
ALTER TABLE [dbo].[users] ADD  DEFAULT ((0)) FOR [email_verified]
GO
ALTER TABLE [dbo].[assessment_assignments]  WITH CHECK ADD FOREIGN KEY([candidate_id])
REFERENCES [dbo].[candidates] ([id])
GO
ALTER TABLE [dbo].[assessment_assignments]  WITH CHECK ADD FOREIGN KEY([status_id])
REFERENCES [dbo].[assessment_statuses] ([id])
GO
ALTER TABLE [dbo].[assessment_assignments]  WITH CHECK ADD FOREIGN KEY([test_id])
REFERENCES [dbo].[assessments] ([id])
GO
ALTER TABLE [dbo].[assessments]  WITH CHECK ADD FOREIGN KEY([created_by])
REFERENCES [dbo].[users] ([id])
GO
ALTER TABLE [dbo].[assessments]  WITH CHECK ADD FOREIGN KEY([organization_id])
REFERENCES [dbo].[organizations] ([id])
GO
ALTER TABLE [dbo].[candidates]  WITH CHECK ADD FOREIGN KEY([user_id])
REFERENCES [dbo].[users] ([id])
GO
ALTER TABLE [dbo].[coding_questions]  WITH CHECK ADD FOREIGN KEY([question_id])
REFERENCES [dbo].[questions] ([id])
GO
ALTER TABLE [dbo].[essay_questions]  WITH CHECK ADD FOREIGN KEY([question_id])
REFERENCES [dbo].[questions] ([id])
GO
ALTER TABLE [dbo].[mcq_questions]  WITH CHECK ADD FOREIGN KEY([question_id])
REFERENCES [dbo].[questions] ([id])
GO
ALTER TABLE [dbo].[options]  WITH CHECK ADD FOREIGN KEY([mcq_question_id])
REFERENCES [dbo].[mcq_questions] ([id])
GO
ALTER TABLE [dbo].[organization_candidates]  WITH CHECK ADD FOREIGN KEY([candidate_id])
REFERENCES [dbo].[candidates] ([id])
GO
ALTER TABLE [dbo].[organization_candidates]  WITH CHECK ADD FOREIGN KEY([organization_id])
REFERENCES [dbo].[organizations] ([id])
GO
ALTER TABLE [dbo].[organizations]  WITH CHECK ADD FOREIGN KEY([address_id])
REFERENCES [dbo].[addresses] ([id])
GO
ALTER TABLE [dbo].[organizations]  WITH CHECK ADD FOREIGN KEY([subscription_plan_id])
REFERENCES [dbo].[subscription_plans] ([id])
GO
ALTER TABLE [dbo].[questions]  WITH CHECK ADD FOREIGN KEY([assessment_id])
REFERENCES [dbo].[assessments] ([id])
GO
ALTER TABLE [dbo].[recruiters]  WITH CHECK ADD FOREIGN KEY([organization_id])
REFERENCES [dbo].[organizations] ([id])
GO
ALTER TABLE [dbo].[recruiters]  WITH CHECK ADD FOREIGN KEY([user_id])
REFERENCES [dbo].[users] ([id])
GO
ALTER TABLE [dbo].[responses]  WITH CHECK ADD FOREIGN KEY([assignment_id])
REFERENCES [dbo].[assessment_assignments] ([id])
GO
ALTER TABLE [dbo].[responses]  WITH CHECK ADD FOREIGN KEY([question_id])
REFERENCES [dbo].[questions] ([id])
GO
ALTER TABLE [dbo].[users]  WITH CHECK ADD FOREIGN KEY([role_id])
REFERENCES [dbo].[roles] ([id])
GO
USE [master]
GO
ALTER DATABASE [Coding_Assessment_Platform] SET  READ_WRITE 
GO
