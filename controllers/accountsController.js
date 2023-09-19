const Users = require("../models/Users");
const mongoose = require("mongoose");
const Carts = require("../models/Carts");
const createToken = require("../middlewares/createToken");
const bcrypt = require("bcrypt");
const { TOO_MANY_REQUESTS } = require("http-status");

class UsersController {
  async getAllAccounts(req, res, next) {
    await Users.find({})
      .then((users) => {
        res.json(users);
      })
      .catch(next);
  }

  //sign up
  // api/accounts/signup
  // body: {
  //    "_fname":"chau anh",
  //    "_lname":"nguyen kieu",
  //    "_email": "nguyenkieu@gmail.com",
  //    "_role":"customer",
  //    "_pw": "17Tcn9921%"
  // }
  signUp = async (req, res, next) => {
    // Hash the password with the generated salt
    // Generate a salt to hash the password
    const saltRounds = 10;
    let password = req.body._pw;
    bcrypt.genSalt(saltRounds, (err, salt) => {
      if (err) {
        return res.status(500).json({
          error:
            "Đăng ký thất bại: xảy ra lỗi trong quá trình mã hóa mật khẩu!",
        });
      }
      // Hash the password with the generated salt
      bcrypt.hash(password, salt, async (err, hash) => {
        if (err) {
          return res.status(500).json({
            error:
              "Đăng ký thất bại: xảy ra lỗi trong quá trình mã hóa mật khẩu!",
          });
        }

        // Create a new user document with the hashed password
        const newUser = {
          _id: new mongoose.Types.ObjectId(),
          _fname: req.body._fname,
          _lname: req.body._lname,
          _email: req.body._email,
          _pw: hash,
          _role: "customer",
          _phones: [],
          _dateOfBirth: new Date(),
          _gender: "",
          _avatar: "",
        };

        try {
          const email = await Users.findOne({ _email: newUser._email });
          if (!email) {
            await Users.create(newUser);
            await Carts.create({
              uId: newUser._id,
              _cartItems: [],
            });
            res.status(201).json({
              message: "Đăng ký tài khoản mới thành công!",
            });
          } else {
            res.status(400).json({
              message: "Email này đã được đăng ký, vui lòng dùng email khác!",
              data: {
                email: newUser._email,
              },
            });
          }
        } catch (err) {
          res.status(400).json({
            message: err.message,
          });
        }
      });
    });
  };

  // log in
  // api/accounts/login
  // body: {
  //    "_email": "lamanh@gmail.com",
  //    "_pw": "17Tcn940282$"
  // }
  logIn = async (req, res, next) => {
    const user = {
      _email: req.body._email,
      _pw: req.body._pw,
    };

    try {
      const auth = await Users.findOne({
        _email: user._email,
        _role: { $nin: ["admin", "shipper"] },
      });
      if (auth) {
        // Compare the entered password with the stored hash
        const passwordMatch = await bcrypt.compare(user._pw, auth._pw);

        if (!passwordMatch) {
          return res.status(401).json({
            error: "Đăng nhập thất bại, mật khẩu sai không chính xác!",
          });
        }
        //Tạo token ở đây
        let token = createToken(auth, "3d");
        res.status(200).json({
          message: "Đăng nhập thành công!",
          token: token,
        });
      } else {
        res.status(400).json({
          message: "Email hoặc mật khẩu không chính xác!",
        });
      }
    } catch (err) {
      res.status(400).json({
        message: err.message,
      });
    }
  };

  adminLogIn = async (req, res, next) => {
    const user = {
      _email: req.body._email,
      _pw: req.body._pw,
    };
    try {
      const auth = await Users.findOne({
        _email: user._email,
        _pw: user._pw,
        _role: "admin",
      });
      if (auth) {
        // Compare the entered password with the stored hash
        // const passwordMatch = await bcrypt.compare(user._pw, auth._pw);

        // if (!passwordMatch) {
        //     return res.status(401).json({ error: 'Đăng nhập thất bại, mật khẩu sai không chính xác!' });
        // }
        //Tạo token ở đây
        let token = createToken(auth);
        res.status(200).json({
          message: "Đăng nhập thành công!",
          token: token,
        });
      } else {
        res.status(400).json({
          message: "Không tìm thấy email!",
        });
      }
    } catch (err) {
      res.status(400).json({
        message: err.message,
      });
    }
  };

  shipperLogIn = async (req, res, next) => {
    const user = {
      _email: req.body._email,
      _pw: req.body._pw,
    };
    try {
      const auth = await Users.findOne({
        _email: user._email,
        _pw: user._pw,
        _role: "shipper",
      });
      if (auth) {
        // Compare the entered password with the stored hash
        // const passwordMatch = await bcrypt.compare(user._pw, auth._pw);

        // if (!passwordMatch) {
        //     return res.status(401).json({ error: 'Đăng nhập thất bại, mật khẩu sai không chính xác!' });
        // }
        //Tạo token ở đây
        let token = createToken(auth);
        res.status(200).json({
          message: "Đăng nhập thành công!",
          token: token,
        });
      } else {
        res.status(400).json({
          message: "Email hoặc mật khẩu không chính xác!",
        });
      }
    } catch (err) {
      res.status(400).json({
        message: err.message,
      });
    }
  };

  // Quên mật khẩu
  resetPasswordForCustomers = async (req, res, next) => {
    const { email, password } = req.body;
    try {
      const saltRounds = 10;
      bcrypt.genSalt(saltRounds, (err, salt) => {
        if (err) {
          return res.status(500).json({
            error:
              "Đăng ký thất bại: xảy ra lỗi trong quá trình mã hóa mật khẩu!",
          });
        }
        // Hash the password with the generated salt
        bcrypt.hash(password, salt, async (err, hash) => {
          if (err) {
            return res
              .status(500)
              .json({ error: "Xảy ra lỗi trong quá trình mã hóa mật khẩu!" });
          }
          const user = await Users.findOneAndUpdate(
            { _email: email, _role: "customer" },
            {
              _pw: hash,
            },
            { new: true }
          );

          if (user) {
            res.status(200).json({
              message: "Reset mật khẩu thành công!",
              newPassword: hash,
            });
          } else {
            res.status(200).json({
              message: "Reset mật khẩu thất bại!",
              newPassword: hash,
            });
          }
        });
      });
    } catch (error) {
      res.status(500).json({
        message: "Có lỗi xảy ra trong quá trình reset mật khẩu!",
        error: error.message,
      });
    }
  };

  //http://localhost:5000/api/accounts/getProfile
  //method: GET
  //token bearer
  getProfile = async (req, res, next) => {
    console.log("user", req);
    const { _id, _role } = req.user;
    try {
      const user = await Users.findOne({ _id: _id, _role: _role });
      if (user) {
        res.status(200).json({
          message: "Lấy hồ sơ thành công!",
          data: {
            user: user,
          },
        });
      } else {
        res.status(400).json({
          message: "Không tìm thấy người dùng!",
        });
      }
    } catch (error) {
      res.status(400).json({
        message: "Có lỗi xảy ra trong quá trình lấy hồ sơ!",
        error: error.message,
      });
    }
  };

  //http://localhost:5000/api/accounts/updateProfile
  //method: POST
  // token bearer
  // body: {
  //     {

  //         "_fname":"My",
  //         "_lname": "Tra",
  //         "_phones": [
  //             "0938049556",
  //             "0994886620",
  //             "0913935810"
  //         ],
  //         "_email":"mytran070202@gmail.com",
  //         "_dateOfBirth": "2002-12-09",
  //         "_gender":"male",
  //         "avatar":"https://lh3.googleusercontent.com/ogw/AGvuzYZ97zGHplrj5kwwvMUP3V3XYo97H9v-s-NCvLgLeA=s32-c-mo",
  //         "_addresses":[
  //             "566 Nguyễn Thái Sơn, F5, Q.GV, TP.HCM"
  //         ]

  // }
  // }
  updateProfile = async (req, res, next) => {
    const {
      _fname,
      _lname,
      _phones,
      _email,
      _dateOfBirth,
      _gender,
      _avatar,
      _addresses,
    } = req.body;
    const { _id, _role } = req.user;
    try {
      const user = await Users.findOneAndUpdate(
        { _id: _id, _role: _role },
        {
          _fname: _fname,
          _lname: _lname,
          _phones: _phones,
          _email: _email,
          _dateOfBirth: _dateOfBirth,
          _gender: _gender,
          _avatar: _avatar,
          _addresses: _addresses,
        },
        {
          new: true,
        }
      );
      if (user) {
        res.status(200).json({
          message: "Cập nhật hồ sơ thành công!",
          data: {
            updatedUser: user,
          },
        });
      } else {
        res.status(400).json({
          message: "Cập nhật không thành công!",
        });
      }
    } catch (error) {
      res.status(400).json({
        message: "Cập nhật không thành công!",
        error: error.message,
      });
    }
  };

  // đổi mật khẩu sau khi đăng nhập vào ứng dụng
  //http://localhost:5000/api/accounts/changePassWord
  // method: PUT
  // token bearer
  // body: {
  //     {
  //         "oldPassword":"176tcn940282$$",
  //         "newPassword": "176tcn940282$$",
  //         "retypedNewPassword": "176tcn940282$$"
  //     }
  // }

  changePassWord = async (req, res, next) => {
    const { oldPassword, newPassword, retypedNewPassword } = req.body;
    const { _id, _role } = req.user;

    try {
      const user = await Users.findOne({ _id: _id, _role: _role });
      if (user) {
        try {
          const passwordMatch = await bcrypt.compare(oldPassword, user._pw);
          if (!passwordMatch) {
            res.status(400).json({
              message: "Đổi mật khẩu thất bại, mật khẫu cũ bị sai!",
            });
          }

          if (newPassword === retypedNewPassword) {
            const saltRounds = 10;
            bcrypt.genSalt(saltRounds, (err, salt) => {
              if (err) {
                return res.status(500).json({
                  error:
                    "Đăng ký thất bại: xảy ra lỗi trong quá trình mã hóa mật khẩu!",
                });
              }
              // Hash the password with the generated salt
              bcrypt.hash(newPassword, salt, async (err, hash) => {
                if (err) {
                  return res.status(500).json({
                    error:
                      "Đổi mật khẩu thất bại: xảy ra lỗi trong quá trình mã hóa mật khẩu!",
                  });
                }
                //Cập nhật mật khẩu
                try {
                  const updatedUser = await Users.findOneAndUpdate(
                    { _id: _id, _role: _role },
                    {
                      _pw: hash,
                    },
                    { new: true }
                  );
                  res.status(200).json({
                    message: "Cập nhật mật khẩu mới thành công!",
                    newPassword: newPassword,
                  });
                } catch (err) {
                  res.status(400).json({
                    message: "Cập nhật mật khẩu mới thất bại!",
                  });
                }
              });
            });
          } else {
            res.status(400).json({
              message: "Mật khẩu nhập lại không trùng khớp!",
            });
          }
        } catch (e) {
          res.status(400).json({
            message: "Đổi mật khẩu thất bại!",
            error: e.message,
          });
        }
      } else {
        res.status(400).json({
          message: "Cập nhật mật khẩu mới thất bại, không tìm thấy user!",
        });
      }
    } catch (err) {}
  };

  //post new comments
}

module.exports = new UsersController();
