import passport from 'passport'
import passportLocal from 'passport-local'
import { Request, Response, NextFunction } from "express";
import {  compare } from 'bcrypt'
import { DI } from '../index'

const LocalStrategy = passportLocal.Strategy
    passport.serializeUser((user, done) => {
        done(null,user)
    })


    passport.deserializeUser(async (id: any, done) => {
        const user = await DI.usersRepository.findOne({
            id:id
        })

        if(user)
        done(null, user.id)
    })

passport.use(new LocalStrategy(
    async  (username, password, done)=> {
         const user = await DI.usersRepository.findOne({username})

         if(!user)
             return done(null, false, {message: 'Usuario inexistente'})

         if(!await compare(password, user.password))
             return done(null, false, {message: 'Contraseña incorrecta'})

         return done(user)
     }
 ))


 export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
};