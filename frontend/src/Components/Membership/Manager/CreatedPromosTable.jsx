import React, { useEffect, useState } from 'react'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"
import { AiFillCalendar, AiOutlineSearch } from "react-icons/ai"
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import Swal from "sweetalert2"
import axios from 'axios'
import { useNavigate, useParams } from "react-router-dom"

const CreatedPromosTable = () => {
    
    const [promos, setPromos] = useState([]);
    let navigate = useNavigate();
    const {id} = useParams();

    useEffect(() => {
        const fetchPkgs = async () => {
            try {
                const {data} = await axios.get('http://localhost:8070/package/propackage');
                setPromos(data);
                console.log(data);
            } catch (error) {
                console.error("Error fetching packages:", error);
            }
        }
        fetchPkgs();
    }, []);

    const handleDelete = (id) => {
        Swal.fire({
            title: " sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, reject it!",
        }).then(async (result) => {
            if (result.isConfirmed) {
                axios.delete(`http://localhost:8070/package/propackage/${id}`)
                    .then(response => {
                        Swal.fire({
                            title: "Success",
                            text: "Package rejected successfully",
                            icon: "success",
                        }).then(() => {
                            console.log('Package rejected successfully')
                        })
                        window.location.reload();
                    })
                    .catch(error => {
                        Swal.fire({
                            title: "Error",
                            text: "package rejection failed",
                            icon: "success",
                        }).then(() => {
                            console.log('Error rejecting package:', error);
                        })
                    })
            }
        });
    }

    const handleSend = () => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, Accept it!",
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: "Success",
                    text: "package sent to approval successfully",
                    icon: "success",
                }).then(() => {
                    console.log('package sent to approval successfully')
                })
            }
        })
    }

    const handleEdit = (id) => {
        navigate(`/pkg/editpromo/${id}`);
    };

    const handleCreateReport = () => {
        const doc = new jsPDF();
        doc.setFontSize(16);
        doc.text('Promo Package Report', 14, 22);
        const columns = [
            { header: 'Package Name', dataKey: 'Name' },
            { header: 'Description', dataKey: 'Discription' },
            { header: 'Price', dataKey: 'Price' },
            { header: 'Valid Until', dataKey: 'Duration' }
        ];
        const rows = promos.map(promo => ({
            Name: promo.Name,
            Discription: promo.Discription,
            Price: promo.Price,
            Duration: promo.Duration
        }));
        doc.autoTable(columns, rows);
        doc.save('Promo Package report.pdf');
    }

    return (
        <div className="flex h-screen justify-center items-center bg-gray-100">
            <div className="bg-black/45 h-3/4 w-3/4 rounded-[50px] py-10 px-14 flex flex-col gap-y-8">
                <p className="text-4xl font-bold text-white">Created Promos</p>
                <div className="flex justify-between items-center">
                    <div>
                        <label htmlFor="search" className="text-2xl text-white font-bold align-top mb-15 ml-10">Search : </label>
                        <input
                            type="text"
                            id="search"
                            name="search"
                            className="py-2 pl-10 pr-4 rounded-full border border-gray-300 focus:outline-none focus:border-blue-500"
                            placeholder="Search"
                            value=""
                        />
                    </div>
                </div>
                <div className="w-full">
                    <div className="grid grid-cols-7 bg-blue-700 text-white">
                        <div className="border-2 border-black p-3">Package Name</div>
                        <div className="border-2 border-black p-3">Details</div>
                        <div className="border-2 border-black p-3">Price</div>
                        <div className="border-2 border-black p-3">Validity</div>
                        <div className="border-2 border-black p-3 flex justify-center">Edit</div>
                        <div className="border-2 border-black p-3 flex justify-center">Delete</div>
                        <div className="border-2 border-black p-3 flex justify-center">Send</div>
                    </div>
                    <div className="w-full overflow-auto" style={{ maxHeight: "450px", scrollbarWidth: "none", msOverflowStyle: "none" }}>
                        {promos.length > 0 ? promos.map((prm) => (
                            <div className="grid grid-cols-7 bg-blue-200 text-black" key={prm._id}>
                                <div className="border-2 border-black p-2">{prm.Name}</div>
                                <div className="border-2 border-black p-2">{prm.Discription}</div>
                                <div className="border-2 border-black p-2">{prm.Price}</div>
                                <div className="border-2 border-black p-2">{prm.Duration}</div>
                                <div className="border-2 border-black p-2 flex justify-center">
                                    <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded" onClick={() => handleEdit(prm._id)}>
                                        Edit
                                    </button>
                                </div>
                                <div className="border-2 border-black p-2 flex justify-center">
                                    <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded" onClick={() => handleDelete(prm._id)}>
                                        Delete
                                    </button>
                                </div>
                                <div className="border-2 border-black p-2 flex justify-center">
                                    <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded" onClick={handleSend}>
                                        Send
                                    </button>
                                </div>
                            </div>
                        )) : (<h1 className="text-white">No promos</h1>)}
                    </div>
                </div>
                <div>
                    <button type="" className="bg-blue-500 py-3 px-8 rounded-lg text-lg font-bold hover:bg-blue-700 transition duration-300" onClick={handleCreateReport}>
                        Generate Report
                    </button>
                </div>
            </div>
        </div>
    )
}

export default CreatedPromosTable;

