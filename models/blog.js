export default (sequelize, DataTypes) => {
    const Blog = sequelize.define('Blog', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        doctor_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'doctors',
                key: 'id',
            },
            onDelete: 'CASCADE',
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        updated_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
    }, {
        tableName: 'blogs',
        timestamps: false,
    });

    Blog.associate = (models) => {
        Blog.belongsTo(models.Doctor, {
            foreignKey: 'doctor_id',
            as: 'doctor',
        });
    };

    return Blog;
};
