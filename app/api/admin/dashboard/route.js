//get dashboard data for admin


import {getAuth} from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import authAdmin from "@/middlewares/authAdmin";
import prisma from "@/lib/prisma";
import { all } from "axios";

export async function GET(request) {
   try{
     const {userId}= getAuth(request);   
    const isAdmin= await authAdmin(userId);

    if(!isAdmin){
        return NextResponse.json("Unauthorized", {status: 401});
    }


    //get total orders

    const orders=await prisma.order.count();
    
    //get total store on app
    const stores=await prisma.store.count();


    const allOrders=await prisma.order.findMany({
        select:{createdAt:true,total:true},
        
    });

    let totalRevenue=0;
    allOrders.forEach((order)=>{
        totalRevenue+=order.total;
    });


    const revenue=totalRevenue.toFixed(2);


    const products= await prisma.product.count();   
    const dashboardData={
        orders,
        stores,
        products,
        revenue,
        allOrders
    };
     

    return NextResponse.json({dashboardData});

}   catch(error){
    console.log("Error in admin dashboard GET route:", error);
    return NextResponse.json({error: error.code || error.message}, {status: 400});
   }
}