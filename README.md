<pre>
Task Management System has been developed using React.js and C#.NET. Here are setup guides for this project outlined below.

Frontend Setup:
1. Create the ".env" file in the root folder of the frontend. Then copy the values in the ".env.example".
2. Replace the value of the "VITE_API_URL" with the backend url, 
   which you can find in the "backend/Properties/launchSettings.json" file.
   Then replaced the value of the applicationUrl property under the "http" of "profiles" property.
3. If all of these steps are finished, we can go to the root folder of the frontend, then run "npm install",
   and "npm run dev". Then the frontend is started.

Backend Setup:
1. Redirect to the "appsettings.json" under the backend folder. Replace the "DefaultConnection" with the value of 
   "Server=localhost; Database=TaskManagementSystem; Trusted_Connection=true; TrustServerCertificate=true;".
2. Replace "PasswordKey" and "TokenKey" with any random characters, but I suggest "PasswordKey" should at least
   has 15 long characters. And "TokenKey" should at least has 75 long characters. Otherwise, the server will report
   the error, due to the shortness of the characters.
3. Replace the "FrontendHost" with the url of the frontend.

Azure Data Studio
Because the project was created with the Azure Data Studio, to create a new server, go to the Azure Data Studio GUI, the Server name 
should be localhost. Authentication type should be Windows Authentication. After you finished this part, right click the server you 
just created, and select new query, copy and paste the sql syntax from the Database folder.

After finishing all of these backend setup steps, we could run "dotnet restore" and "dotnet watch run" or "dotnet run".
</pre>
