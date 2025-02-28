CREATE DATABASE TaskManagementSystem
GO

USE TaskManagementSystem
GO

CREATE SCHEMA TaskManagementAPP
GO

CREATE TABLE TaskManagementAPP.Users
(
    User_id INT NOT NULL IDENTITY(1,1),
    Email NVARCHAR(255) NOT NULL,
    First_Name NVARCHAR(255) NOT NULL,
    Last_Name NVARCHAR(255) NOT NULL,
    Password_Hash VARBINARY(MAX) NOT NULL,
    Password_Salt VARBINARY(MAX) NOT NULL,
    Created_at DATETIME2 NOT NULL,
    Updated_at DATETIME2 NOT NULL
)
GO

CREATE TABLE TaskManagementAPP.Tasks
(
    Task_id INT NOT NULL IDENTITY(1,1),
    User_id INT NOT NULL,
    Task_Title NVARCHAR(255) NOT NULL,
    Task_Description NVARCHAR(MAX) NOT NULL,
    Task_Priority VARCHAR(255) NOT NULL,
    Task_Status VARCHAR(255) NOT NULL,
    Created_at DATETIME2 NOT NULL,
    Updated_at DATETIME2 NOT NULL
)
GO