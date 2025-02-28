namespace TaskManagement.Dtos
{
    public partial class PasswordDto
    {
        public int User_id;
        public byte[] Password_Hash;
        public byte[] Password_Salt;

        public PasswordDto()
        {
            if (Password_Hash == null)
            {
                Password_Hash = new byte[0];
            }

            if (Password_Salt == null)
            {
                Password_Salt = new byte[0];
            }
        }
    }
}