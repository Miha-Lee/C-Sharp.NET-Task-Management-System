namespace TaskManagement.Dtos
{
    public partial class ResetPassword
    {
        public string Password { get; set; }
        public string ConfirmPassword { get; set; }

        public ResetPassword()
        {
            if (Password == null)
            {
                Password = "";
            }

            if (ConfirmPassword == null)
            {
                ConfirmPassword = "";
            }
        }
    }
}