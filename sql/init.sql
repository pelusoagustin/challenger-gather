CREATE TABLE Users (
  id INT IDENTITY(1,1) PRIMARY KEY,
  name NVARCHAR(50) NOT NULL UNIQUE,
  createdAt DATETIME NOT NULL CONSTRAINT DF_users_createdAt DEFAULT GETDATE(),
  updatedAt DATETIME NOT NULL CONSTRAINT DF_users_updatedAt DEFAULT GETDATE(),
  createdBy NVARCHAR(50) NOT NULL CONSTRAINT DF_users_createdBy DEFAULT 'system',
  updatedBy NVARCHAR(50) NOT NULL CONSTRAINT DF_users_updatedBy DEFAULT 'system'
);

CREATE TABLE Themes (
  id INT IDENTITY(1,1) PRIMARY KEY,
  name NVARCHAR(50) NOT NULL UNIQUE,
  createdAt DATETIME NOT NULL CONSTRAINT DF_themes_createdAt DEFAULT GETDATE(),
  updatedAt DATETIME NOT NULL CONSTRAINT DF_themes_updatedAt DEFAULT GETDATE(),
  createdBy NVARCHAR(50) NOT NULL CONSTRAINT DF_themes_createdBy DEFAULT 'system',
  updatedBy NVARCHAR(50) NOT NULL CONSTRAINT DF_themes_updatedBy DEFAULT 'system'
);

CREATE TABLE Jokes (
  id INT IDENTITY(1,1) PRIMARY KEY,
  text NVARCHAR(MAX) NOT NULL,
  createdAt DATETIME NOT NULL CONSTRAINT DF_jokes_createdAt DEFAULT GETDATE(),
  updatedAt DATETIME NOT NULL CONSTRAINT DF_jokes_updatedAt DEFAULT GETDATE(),
  createdBy NVARCHAR(50) NOT NULL CONSTRAINT DF_jokes_createdBy DEFAULT 'system',
  updatedBy NVARCHAR(50) NOT NULL CONSTRAINT DF_jokes_updatedBy DEFAULT 'system',
  userId INT  NULL,
  themeId INT NULL,
  CONSTRAINT FK_Jokes_Users FOREIGN KEY (userId) REFERENCES Users(id),
  CONSTRAINT FK_Jokes_Themes FOREIGN KEY (themeId) REFERENCES Themes(id)
);

INSERT INTO Users (name)
VALUES
  (N'Manolito'),
  (N'Pepe'),
  (N'Isabel'),
  (N'Pedro');

INSERT INTO Themes (name)
VALUES
  (N'humor negro'),
  (N'humor amarillo'),
  (N'chistes verdes');

;WITH Seq AS (
  SELECT v.n
  FROM (VALUES (1), (2), (3)) AS v(n)
)
INSERT INTO Jokes (text, createdAt, updatedAt, createdBy, updatedBy, userId, themeId)
SELECT
  CONCAT(N'Chiste ', s.n, N' - ', t.name, N' - ', u.name),
  GETDATE(),
  GETDATE(),
  u.name,
  u.name,
  u.id,
  t.id
FROM Users u
CROSS JOIN Themes t
CROSS JOIN Seq s;