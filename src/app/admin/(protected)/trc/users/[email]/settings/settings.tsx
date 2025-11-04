'use client';
import React, { useEffect, useState } from 'react';
import Cookies from "js-cookie";
import { User, Phone, MessageCircle, Send, Image, Link, ToggleLeft, ToggleRight, Save, DollarSign, Award, Loader2 } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/utils/axios';
import { AxiosError } from 'axios';
import { showToast } from '@/utils/alert';

export default function UserSettingsPage() {
   const [isSaving, setIsSaving] = useState(false);
   const [isLoading, setIsLoading] = useState(true);
   const [saveMessage, setSaveMessage] = useState("");
   const { email } = useParams();
   const [user, setUser] = useState<UserType>({} as UserType);
   const router = useRouter();

   const getUser = async () => {
      const adminToken = Cookies.get("adminToken");

      if (!adminToken) {
         router.replace("/admin/auth/login");
         return;
      }
      
      try {
         setIsLoading(true);
         api.defaults.headers.common["Authorization"] = `Bearer ${adminToken}`;
         const userResponse = await api.get<UserType>(`/admin/user/${email}`);
         setUser(userResponse.data);
      } catch (err) {
         if (err instanceof AxiosError) {
            showToast('error', err.response?.data.message || 'Failed to fetch user');
         } else {
            showToast('error', 'An error occurred');
         }
      } finally {
         setIsLoading(false);
      }
   };

   useEffect(() => {
      getUser();
   }, [email]);

   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setUser(prev => ({
         ...prev,
         [name]: value
      }));
   };

   useEffect(()=> {
      console.log(user)
   },[user])

   const handleSave = async () => {
      setIsSaving(true);
      setSaveMessage("");

      const adminToken = Cookies.get("adminToken");
      
      if (!adminToken) {
         showToast('error', 'Authentication required');
         router.replace("/admin/auth/login");
         return;
      }

      try {
         api.defaults.headers.common["Authorization"] = `Bearer ${adminToken}`;
         
         // Prepare update payload - only include fields that can be updated
         const updatePayload = {
            balance: Number(user.balance),
            totalYield: Number(user.totalYield),
            totalWithdraw: Number(user.totalWithdraw),
            totalDeposit: Number(user.totalDeposit),
            transactionCount: Number(user.transactionCount),
            whatsappNo: user.whatsappNo,
            facebook: user.facebook,
            telegram: user.telegram,
            referredBy: user.referredBy,
            referral_count: Number(user.referral_count),
            vip: Number(user.vip),
         };

         await api.patch(`/admin/user/${email}`, updatePayload);
         
         setSaveMessage("Settings saved successfully!");
         showToast('success', 'User settings updated successfully');
         
         setTimeout(() => setSaveMessage(""), 3000);
      } catch (err) {
         if (err instanceof AxiosError) {
            showToast('error', err.response?.data.message || 'Failed to update user');
         } else {
            showToast('error', 'An error occurred while saving');
         }
      } finally {
         setIsSaving(false);
      }
   };

   if (isLoading) {
      return (
         <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
               <Loader2 className="w-12 h-12 text-gray-900 animate-spin mx-auto mb-4" />
               <p className="text-gray-900 text-lg">Loading user data...</p>
            </div>
         </div>
      );
   }

   return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-8">
         <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-gray-200">
               <div className="flex items-center gap-3 mb-8">
                  <div className="p-3 bg-(--color4) rounded-xl">
                     <User className="w-6 h-6 text-white" />
                  </div>
                  <div>
                     <h1 className="text-3xl font-bold text-gray-900">User Settings</h1>
                     <p className="text-gray-600 text-sm">Manage account preferences for {user.username}</p>
                  </div>
               </div>

               {saveMessage && (
                  <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800 text-center">
                     {saveMessage}
                  </div>
               )}

               <div className="space-y-6">
                  {/* Read-only fields */}
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                     <h2 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h2>
                     <div className="grid md:grid-cols-2 gap-4">
                        <div>
                           <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                           <input
                              type="text"
                              value={user.username || ''}
                              disabled
                              className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg text-gray-500 cursor-not-allowed"
                           />
                        </div>
                        <div>
                           <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                           <input
                              type="email"
                              value={user.email || ''}
                              disabled
                              className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg text-gray-500 cursor-not-allowed"
                           />
                        </div>
                        <div>
                           <label className="block text-sm font-medium text-gray-700 mb-2">User ID</label>
                           <input
                              type="text"
                              value={user.userID || ''}
                              disabled
                              className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg text-gray-500 cursor-not-allowed"
                           />
                        </div>
                        <div>
                           <label className="block text-sm font-medium text-gray-700 mb-2">Referral Code</label>
                           <input
                              type="text"
                              value={user.referral_code || ''}
                              disabled
                              className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg text-gray-500 cursor-not-allowed"
                           />
                        </div>
                     </div>
                  </div>

                  {/* Financial Overview */}
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                     <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <DollarSign className="w-5 h-5 text-gray-700" />
                        Financial Overview
                     </h2>
                     <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div>
                           <label className="block text-sm font-medium text-gray-700 mb-2">Balance</label>
                           <input
                              type="number"
                              name="balance"
                              value={user.balance ?? 0}
                              onChange={handleInputChange}
                              step="0.01"
                              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                           />
                        </div>
                        <div>
                           <label className="block text-sm font-medium text-gray-700 mb-2">Total Yield</label>
                           <input
                              type="number"
                              name="totalYield"
                              value={user.totalYield ?? 0}
                              onChange={handleInputChange}
                              step="0.01"
                              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                           />
                        </div>
                        <div>
                           <label className="block text-sm font-medium text-gray-700 mb-2">Total Withdraw</label>
                           <input
                              type="number"
                              name="totalWithdraw"
                              value={user.totalWithdraw ?? 0}
                              onChange={handleInputChange}
                              step="0.01"
                              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                           />
                        </div>
                        <div>
                           <label className="block text-sm font-medium text-gray-700 mb-2">Total Deposit</label>
                           <input
                              type="number"
                              name="totalDeposit"
                              value={user.totalDeposit ?? 0}
                              onChange={handleInputChange}
                              step="0.01"
                              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                           />
                        </div>
                        <div>
                           <label className="block text-sm font-medium text-gray-700 mb-2">Transaction Count</label>
                           <input
                              type="number"
                              name="transactionCount"
                              value={user.transactionCount ?? 0}
                              onChange={handleInputChange}
                              min="0"
                              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                           />
                        </div>
                     </div>
                  </div>

                  {/* Referral Information */}
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                     <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Award className="w-5 h-5 text-gray-700" />
                        Referral Information
                     </h2>
                     <div className="grid md:grid-cols-2 gap-4">
                        <div>
                           <label className="block text-sm font-medium text-gray-700 mb-2">Referred By</label>
                           <input
                              type="text"
                              name="referredBy"
                              value={user.referredBy || ""}
                              onChange={handleInputChange}
                              placeholder="Enter referrer ID"
                              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                           />
                        </div>
                        <div>
                           <label className="block text-sm font-medium text-gray-700 mb-2">Referral Count</label>
                           <input
                              type="number"
                              name="referral_count"
                              value={user.referral_count ?? 0}
                              onChange={handleInputChange}
                              min="0"
                              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                           />
                        </div>
                     </div>
                  </div>

                  {/* Contact Information */}
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                     <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h2>
                     <div className="space-y-4">
                        <div>
                           <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                              <Phone className="w-4 h-4 text-gray-700" />
                              WhatsApp Number
                           </label>
                           <input
                              type="text"
                              name="whatsappNo"
                              value={user.whatsappNo || ''}
                              onChange={handleInputChange}
                              placeholder="Enter your WhatsApp number"
                              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                           />
                        </div>
                        <div>
                           <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                              <MessageCircle className="w-4 h-4 text-gray-700" />
                              Facebook
                           </label>
                           <input
                              type="text"
                              name="facebook"
                              value={user.facebook || ''}
                              onChange={handleInputChange}
                              placeholder="Enter your Facebook profile URL"
                              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                           />
                        </div>
                        <div>
                           <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                              <Send className="w-4 h-4 text-gray-700" />
                              Telegram
                           </label>
                           <input
                              type="text"
                              name="telegram"
                              value={user.telegram || ''}
                              onChange={handleInputChange}
                              placeholder="Enter your Telegram username"
                              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                           />
                        </div>
                     </div>
                  </div>

                  {/* Settings & Levels */}
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                     <h2 className="text-lg font-semibold text-gray-900 mb-4">Levels</h2>
                     <div className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                           <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">VIP Level</label>
                              <input
                                 type="number"
                                 name="vip"
                                 value={user.vip ?? 0}
                                 onChange={handleInputChange}
                                 min="0"
                                 max="10"
                                 className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                              />
                           </div>
                        </div>
                     </div>
                  </div>

                  {/* Save Button */}
                  <button
                     onClick={handleSave}
                     disabled={isSaving}
                     className="w-full py-4 bg-(--color4) hover:bg-(--color4)/90 text-white font-semibold rounded-xl shadow-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                     {isSaving ? (
                        <>
                           <Loader2 className="w-5 h-5 animate-spin" />
                           Saving...
                        </>
                     ) : (
                        <>
                           <Save className="w-5 h-5" />
                           Save Changes
                        </>
                     )}
                  </button>
               </div>
            </div>
         </div>
      </div>
   );
}