import {getAuth} from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import authAdmin from "@/middlewares/authAdmin";

import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

//approve seller

export async function POST(request) {
    try{
       
        const user=await currentUser();
          if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
         const isAdmin= await authAdmin(user.id);

          if(!isAdmin){
                     return NextResponse.json("Unauthorized for ADMIN", {status: 401});
                 }
         const {storeId,status}= await request.json();

         if(status==="approved"){
            await prisma.store.update({
                where:{id: storeId},
                data:{status:"approved",isActive: true}
            })
         }else if(status==="rejected"){
            await prisma.store.update({
                where:{id: storeId},
                data:{status:"rejected"}
            })
         }

            return NextResponse.json({message: `Store ${status} successfully`});
    } catch(error){
         console.error(error);
        return NextResponse.json({error: error.code || error.message}, {status: 400});

    }
}




//get all pending and rejected stores 

export async function GET(request) {
    try{
        const user = await currentUser();
         if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
        const isAdmin= await authAdmin(user.id);

        if(!isAdmin){
            return NextResponse.json("Unauthorized for ADMIN", {status: 401});
        }

        const stores= await prisma.store.findMany({
            where:{
                status:{
                    in:["pending","rejected"]
                }
            },
            include:{user:true}
        });
        console.log("ADMIN FETCH STORES:", stores.length);
        return NextResponse.json({stores});


    }catch(error){
        console.log("Error in approve-store GET route:", error);
        return NextResponse.json({error: error.code || error.message}, {status: 400});
    }
}