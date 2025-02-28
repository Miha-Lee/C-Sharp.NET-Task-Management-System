using System.Data;
using System.Security.Cryptography;
using Dapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TaskManagement.Data;
using TaskManagement.Dtos;
using TaskManagement.Helpers;

namespace TaskManagement.Controllers
{
    [Authorize]
    [ApiController]
    [Route("[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly DataContextDapper _dapper;
        private readonly AuthHelper _authHelper;

        public AuthController(IConfiguration config)
        {
            _dapper = new DataContextDapper(config);
            _authHelper = new AuthHelper(config);
        }

        [AllowAnonymous]
        [HttpPost("Register")]
        public IActionResult Register(Register register)
        {
            if (register.Password != register.PasswordConfirm)
            {
                return Ok(new
                {
                    Success = false,
                    Message = "Password and Password Confirm are not matched"
                });
            }

            if (register.Password.Length < 8)
            {
                return Ok(new
                {
                    Success = false,
                    Message = "Password should at least has 8 characters"
                });
            }

            string sqlUserCheck = @$"
                SELECT Email FROM TaskManagementAPP.Users
                WHERE Email = '{register.Email}'
            ";

            if (_dapper.LoadDataSingleCheck<string>(sqlUserCheck) == null)
            {
                byte[] passwordSalt = new byte[128 / 8];

                using (RandomNumberGenerator rng = RandomNumberGenerator.Create())
                {
                    rng.GetNonZeroBytes(passwordSalt);
                }

                byte[] passwordHash = _authHelper.GetPasswordHash(register.Password, passwordSalt);

                string sqlAddAuth = @$"
                    INSERT INTO TaskManagementAPP.Users
                    (
                        Email,
                        First_Name,
                        Last_Name,
                        Password_Hash,
                        Password_Salt,
                        Created_at,
                        Updated_at
                    )
                    VALUES(
                        '{register.Email}',
                        '{register.First_Name}',
                        '{register.Last_Name}',
                        @passwordParam,
                        @passwordSaltParam,
                        GETDATE(),
                        GETDATE()
                    )
                ";

                DynamicParameters parameters = new DynamicParameters();
                parameters.Add("@passwordParam", passwordHash, DbType.Binary);
                parameters.Add("@passwordSaltParam", passwordSalt, DbType.Binary);

                if (_dapper.ExecuteSqlWithParams(sqlAddAuth, parameters))
                {
                    return Ok(new
                    {
                        Success = true,
                        Message = "Registered Successfully"
                    });
                }

                throw new Exception("Unable to register the user");
            }

            return Ok(new
            {
                Success = false,
                Message = "Email has been registered"
            });
        }

        [AllowAnonymous]
        [HttpPost("Login")]
        public IActionResult Login(LoginDto login)
        {
            string sqlEmailCheck = @$"
                SELECT 
                    User_id,
                    Password_Hash,
                    Password_Salt
                FROM TaskManagementAPP.Users
                WHERE Email = '{login.Email}'
            ";

            PasswordDto? passwordHashSalt = _dapper.LoadDataSingleCheck<PasswordDto>(sqlEmailCheck);

            if (passwordHashSalt == null)
            {
                return Ok(new
                {
                    Success = false,
                    Message = "Email has not been registered"
                });
            }

            byte[] passwordHash = _authHelper.GetPasswordHash(login.Password, passwordHashSalt.Password_Salt);

            for (int i = 0; i < passwordHash.Length; i++)
            {
                if (passwordHash[i] != passwordHashSalt.Password_Hash[i])
                {
                    return Ok(new
                    {
                        Success = false,
                        Message = "Incorrect password"
                    });
                }
            }

            string userDetailSql = @$"
                SELECT Email,
                       First_Name,
                       Last_Name
                FROM TaskManagementAPP.Users
                WHERE Email = '{login.Email}'
            ";

            UserDetail? userDetail = _dapper.LoadDataSingleCheck<UserDetail>(userDetailSql);

            return Ok(new
            {
                Success = true,
                Message = "Login Successfully",
                Token = _authHelper.CreateToken(passwordHashSalt.User_id),
                UserDetail = userDetail
            });
        }

        [HttpPut("ResetPassword")]
        public IActionResult ResetPassword(ResetPassword resetPassword)
        {
            if (resetPassword.Password != resetPassword.ConfirmPassword)
            {
                return Ok(new
                {
                    Success = false,
                    Title = "Error",
                    Message = "Password and Confirm Password are not matched",
                });
            }

            if (resetPassword.Password.Length < 8)
            {
                return Ok(new
                {
                    Success = false,
                    Title = "Error",
                    Message = "Password should at least has 8 characters",
                });
            }

            string sql = @$"
                SELECT Email,
                       First_Name,
                       Last_Name
                FROM TaskManagementAPP.Users
                WHERE User_id = {this.User.FindFirst("userId")?.Value}
            ";

            UserDetail? userDetail = _dapper.LoadDataSingleCheck<UserDetail>(sql);

            if (userDetail == null)
            {
                return Ok(new
                {
                    Success = false,
                    Title = "Please Login again",
                    Message = "User cannot be found",
                });
            }

            byte[] passwordSalt = new byte[128 / 8];

            using (RandomNumberGenerator rng = RandomNumberGenerator.Create())
            {
                rng.GetNonZeroBytes(passwordSalt);
            }

            byte[] passwordHash = _authHelper.GetPasswordHash(resetPassword.Password, passwordSalt);

            string sqlUpdateAuth = @$"
                UPDATE TaskManagementAPP.Users
                SET 
                    Password_Hash = @passwordHashParam,
                    Password_Salt = @passwordSaltParam
                WHERE User_id = {this.User.FindFirst("userId")?.Value}
            ";

            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("@passwordHashParam", passwordHash, DbType.Binary);
            parameters.Add("@passwordSaltParam", passwordSalt, DbType.Binary);

            if (_dapper.ExecuteSqlWithParams(sqlUpdateAuth, parameters))
            {
                return Ok(new
                {
                    Success = true,
                    Message = "Reset the password success"
                });
            }

            throw new Exception("Unable to reset the password");
        }

        [HttpGet("UserDetail")]
        public IActionResult UserDetail()
        {
            string sql = @$"
                SELECT Email,
                       First_Name,
                       Last_Name
                FROM TaskManagementAPP.Users
                WHERE User_id = {this.User.FindFirst("userId")?.Value}
            ";

            UserDetail? userDetail = _dapper.LoadDataSingleCheck<UserDetail>(sql);

            if (userDetail == null)
            {
                return Ok(new
                {
                    Success = false,
                    Message = "User cannot be found",
                });
            }

            return Ok(new
            {
                Success = true,
                UserDetail = userDetail
            });
        }

        [HttpPut("UpdateUserDetail")]
        public IActionResult UpdateUserDetail(UpdateUserDetail updateUserDetail)
        {
            string sql = @$"
                SELECT Email,
                       First_Name,
                       Last_Name
                FROM TaskManagementAPP.Users
                WHERE User_id = {this.User.FindFirst("userId")?.Value}
            ";

            UserDetail? userDetail = _dapper.LoadDataSingleCheck<UserDetail>(sql);

            if (userDetail == null)
            {
                return Ok(new
                {
                    Success = false,
                    Message = "User cannot be found",
                });
            }

            string updateUserDetailSql = @$"
                UPDATE TaskManagementAPP.Users
                    SET First_Name = '{updateUserDetail.First_Name}',
                        Last_Name = '{updateUserDetail.Last_Name}',
                        Updated_at = GETDATE()
                    WHERE User_id = {this.User.FindFirst("userId")?.Value}
            ";


            if (_dapper.ExecuteSql(updateUserDetailSql))
            {
                UserDetail? userDetailLatest = _dapper.LoadDataSingleCheck<UserDetail>(sql);

                return Ok(new
                {
                    Success = true,
                    Message = "Update the User Detail Success",
                    UserDetail = userDetailLatest
                });
            }

            throw new Exception("Unable to update the user detail");
        }
    }
}