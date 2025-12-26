import { NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import authSeller from "@/middlewares/authSeller";

//auth seller

export async function POST(request)
{
     try{

        const { userId } = getAuth(request);
        const isSeller = await authSeller(userId);
             if(!isSeller){
             return NextResponse.json({error:"seller not authorized"}, { status: 401 });
            }
           const storeInfo= await prisma.store.findUnique({
            where:{userId:userId}
           })
           return NextResponse.json({isSeller,storeInfo});

     }catch(error){
       console.error("Error  stock toggling:", error);
       return NextResponse.json({error: error.code || error.message}, { status: 400 });
     
     }
}