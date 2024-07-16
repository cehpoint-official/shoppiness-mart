// const PrivacyPolicy = () => {
//   const policies = [
//     {
//       title: "Privacy-policies-1",
//       content:
//         "Lorem ipsum dolor sit amet consectetur adipisicing elit. Blanditiis,commodi tempora mollitia voluptatem recusandae impedit totam aperiam nesciunt doloremque magni neque placeat, laborum nisi eum quae voluptatum Lorem ipsum dolor sit amet consectetur adipisicing elit. Blanditiis,commodi tempora mollitia voluptatem recusandae impedit totam aperiam nesciunt doloremque magni neque placeat, laborum nisi eum quae voluptatum recusandae impedit totam aperiam nesciunt doloremque magni neque placeat, laborum nisi",
//     },
//     {
//       title: "Privacy-policies-2",
//       content:
//         "Lorem ipsum dolor sit amet consectetur adipisicing elit. Blanditiis,commodi tempora mollitia voluptatem recusandae impedit totam aperiam nesciunt doloremque magni neque placeat, laborum nisi eum quae voluptatum Lorem ipsum dolor sit amet consectetur adipisicing elit. Blanditiis,commodi tempora mollitia voluptatem recusandae impedit totam aperiam nesciunt doloremque magni neque placeat, laborum nisi eum quae voluptatum recusandae impedit totam aperiam nesciunt doloremque magni neque placeat, laborum nisi",
//     },
//     {
//       title: "Privacy-policies-3",
//       content:
//         "Lorem ipsum dolor sit amet consectetur adipisicing elit. Blanditiis,commodi tempora mollitia voluptatem recusandae impedit totam aperiam nesciunt doloremque magni neque placeat, laborum nisi eum quae voluptatum Lorem ipsum dolor sit amet consectetur adipisicing elit. Blanditiis,commodi tempora mollitia voluptatem recusandae impedit totam aperiam nesciunt doloremque magni neque placeat, laborum nisi eum quae voluptatum recusandae impedit totam aperiam nesciunt doloremque magni neque placeat, laborum nisi",
//     },
//   ];
//   return (
//     <div className="mt-10">
//       <div>
//         <p className="text-center font-medium text-3xl my-10">Privacy Policy</p>
//       </div>
//       {/* policies list and disclaimer */}
//       <div className="flex justify-center gap-10 flex-wrap">
//         {/* list */}
//         <div style={{ boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px" }}>
//           <h1 className="px-14 py-2 font-semibold text-lg text-center">
//             Policies
//           </h1>
//           {policies?.map((item, index) => {
//             return (
//               <div key={index}>
//                 <a href={`#${item?.title}`}>
//                   <p className="px-14 py-1 my-2  hover:bg-[#EDF6FB]">
//                     {item?.title}
//                   </p>
//                 </a>
//               </div>
//             );
//           })}
//         </div>

//         {/* disclaimer */}
//         <div
//           className="md:w-[70%] p-10"
//           style={{ boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px" }}
//         >
//           {policies?.map((item, index) => {
//             return (
//               <div id={`${item?.title}`} key={index}>
//                 <h1 className="text-2xl">{item?.title}</h1>
//                 <p className="my-4">{item?.content}</p>
//               </div>
//             );
//           })}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PrivacyPolicy;
