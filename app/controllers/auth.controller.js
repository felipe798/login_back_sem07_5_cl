import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { JWT_SECRET } from "../config/auth.config.js";
import db from "../models/index.js";

const User = db.user;
const Role = db.role;

export const signup = async (req, res) => {
  try {
    // Crear usuario
    const user = await User.create({
      username: req.body.username,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 8)
    });

    // Asignar roles al usuario
    if (req.body.roles) {
      const roles = await Role.findAll({
        where: {
          name: {
            [db.Sequelize.Op.or]: req.body.roles
          }
        }
      });

      await user.setRoles(roles);
      res.send({ message: "User registered successfully!" });
    } else {
      // Si no se especifican roles, asignar el rol "user" por defecto
      const role = await Role.findOne({
        where: { name: "user" }
      });
      
      await user.setRoles([role]);
      res.send({ message: "User registered successfully!" });
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

export const signin = async (req, res) => {
  try {
    const user = await User.findOne({
      where: {
        username: req.body.username
      }
    });

    if (!user) {
      return res.status(404).send({ message: "User Not found." });
    }

    const passwordIsValid = bcrypt.compareSync(
      req.body.password,
      user.password
    );

    if (!passwordIsValid) {
      return res.status(401).send({
        accessToken: null,
        message: "Invalid Password!"
      });
    }

    const token = jwt.sign({ id: user.id }, JWT_SECRET, {
      expiresIn: 86400 // 24 horas
    });

    const authorities = [];
    const roles = await user.getRoles();
    
    for (let i = 0; i < roles.length; i++) {
      authorities.push("ROLE_" + roles[i].name.toUpperCase());
    }

    res.status(200).send({
      id: user.id,
      username: user.username,
      email: user.email,
      roles: authorities,
      accessToken: token
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};