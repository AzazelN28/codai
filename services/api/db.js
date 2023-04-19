import { Sequelize } from 'sequelize'

export default async function init()
{
  const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './db.sqlite',
  })

  sequelize.sync(
    /*
    { force: process.env.NODE_ENV !== 'production' }
    */
  )

  const Pen = sequelize.define('pen', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    html: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    css: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    js: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  })

  const Chat = sequelize.define('chat', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    pen_id: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    message: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    role: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  })

  return {
    sequelize,
    Chat,
    Pen,
  }
}
