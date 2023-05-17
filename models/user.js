const { resolve } = require('path');
const db = require('../config/database');
const { rejects } = require('assert');


const user = {
    // {
    //     "id" : "test",
    //     "pwd" : "1234",
    //     "profileImgNumber" : "0",
    //     "nickname" : "tester",
    //     "email" : "test@hansung.ac.kr",
    //     "github" : "https://github.com/tester",
    //     "is_admin" : 0,
    //     "authentication" : 0,
    //     "c" : 0,
    //     "cPlus" : 0,
    //     "cSharp" : 0,
    //     "java" : 0,
    //     "kotlin" : 0,
    //     "swift" : 0,
    //     "python" : 0,
    //     "go" : 0,
    //     "javascript" : 0,
    //     "rust" : 0,
    //     "ruby" : 0,
    //     "codereview" : 0,
    //     "refactoring" : 0,
    //     "qa" : 0
    // }


    //회원가입단
    signUp: {
        setUserInfo: (userInfo, languageInfo, activityInfo) => {
            return new Promise((resolve, reject) => {
                let user = Object.values(userInfo);
                let language = Object.values(languageInfo);
                let activity = Object.values(activityInfo);

                db.getConnection((err, connection) => {
                    connection.beginTransaction((err) => {
                        if (!err) {
                            let sql1 = `INSERT INTO USER_TB VALUES ( ID_PK, ?)`;
                            let sql2 = `INSERT INTO LANGUAGE_TB VALUES ( ? )`;
                            let sql3 = `INSERT INTO ACTIVITY_TB VALUES (?)`;

                            connection.query(sql1, [user], (err, res) => {
                                if (err)
                                    return connection.rollback(() => { throw err });

                                connection.query(sql2, [language], (err, res) => {
                                    if (err)
                                        return connection.rollback(() => { throw err });

                                    connection.query(sql3, [activity], (err, res) => {
                                        if (err)
                                            return connection.rollback(() => { throw err });

                                        connection.commit((err) => {
                                            if (err)
                                                return connection.rollback(() => { throw err });
                                        })
                                        resolve(res);
                                    })
                                })
                            })
                        }
                        else {
                            console.log("connection error" + err)
                            throw err;
                        }
                    })

                })
            })
        },
    },

    //로그인
    signIn: {
        getUserById: (id) => {
            return new Promise((resolve, reject) => {
                db.getConnection((err, connection) => {
                    if (!err) {
                        let sql = `SELECT ID, PASSWORD, NICKNAME, IS_ADMIN FROM USER_TB
                                   WHERE ID LIKE '${id}'`;

                        connection.query(sql, (err, res) => {
                            connection.release();

                            if (err) {
                                console.log("sql error " + err);
                                reject(err);
                            }
                            resolve(res[0]);
                        })
                    }
                    else {
                        console.log("connection error" + err)
                        throw err;
                    }
                })
            })

        },

        getUserPK: (id) => {
            return new Promise((resolve, reject) => {
                db.getConnection((err, connection) => {
                    if (!err) {
                        let sql = `SELECT ID_PK FROM USER_TB WHERE ID LIKE '${id}'`;
                        connection.query(sql, (err, res) => {
                            connection.release();
    
                            if (err) {
                                console.log("sql error " + err);
                                reject(err);
                            }
                            resolve(res[0]);
                        })
                    }
                    else {
                        console.log("connection error" + err)
                        throw err;
                    }
                })
            })

        },

        setRefreshToken: (id, content) => {
            return new Promise((resolve, reject) => {
                db.getConnection((err, connection) => {
                    if(!err)    {
                        let sql = `INSERT INTO token_tb VALUES ( ?, ? )`;
    
                        connection.query(sql, [id.ID_PK, content], (err, res) => {
                            connection.release();
                            
                            if(err) {
                                console.log("sql error " + err);
                                reject(err);
                            }
                            resolve(res);
                        })
                    }
                    else    {
                        console.log("connection error" + err);
                        throw err;
                    }
                })
            })
        }
    }
}



module.exports = user;