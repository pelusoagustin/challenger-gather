-- Consulta 1: chistes creados por el usuario "Manolito"
SELECT j.*
FROM Jokes j
JOIN Users u ON u.id = j.userId
WHERE u.name = N'Manolito';

-- Consulta 2: chistes de la temática "Humor negro"
SELECT j.*
FROM Jokes j
JOIN Themes t ON t.id = j.themeId
WHERE t.name = N'Humor negro';

-- Consulta 3: chistes de "Humor negro" creados por "Manolito"
SELECT j.*
FROM Jokes j
JOIN Users u ON u.id = j.userId
JOIN Themes t ON t.id = j.themeId
WHERE u.name = N'Manolito'
  AND t.name = N'Humor negro';
