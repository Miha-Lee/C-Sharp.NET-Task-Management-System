namespace TaskManagement.Dtos
{
    public partial class Register
    {
        public string Email { get; set; }
        public string First_Name { get; set; }
        public string Last_Name { get; set; }
        public string Password { get; set; }
        public string PasswordConfirm { get; set; }

        public Register()
        {
            if (Email == null)
            {
                Email = "";
            }

            if (First_Name == null)
            {
                First_Name = "";
            }

            if (Last_Name == null)
            {
                Last_Name = "";
            }

            if (Password == null)
            {
                Password = "";
            }

            if (PasswordConfirm == null)
            {
                PasswordConfirm = "";
            }
        }
    }
}