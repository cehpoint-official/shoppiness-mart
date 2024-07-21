import { useState } from "react";
import Loader from "../Components/Loader/Loader";
const PrivacyPolicyPage = () => {
  const [loading, setLoading] = useState(true);
  setInterval(() => {
    setLoading(false);
  }, [3000]);
  const policies = [
    {
      title: "Privacy-policiy-1",
      content:
        "When you use our services, you’re trusting us with your information. We understand that this is a big responsibility and we work hard to protect your information and put you in control.The information we collect, and how that information is used, depends on how you use our services and how you manage your privacy controls.",
    },
    {
      title: "Privacy-policiy-2",
      content:
        "We collect information to provide better services to all our users – from figuring out basic stuff such as which language you speak, to more complex things like which ads you’ll find most useful, the people who matter most to you online or which YouTube videos you might like. The information we collect, and how that information is used, depends on how you use our services and how you manage your privacy controls.",
    },
    {
      title: "Privacy-policiy-3",
      content:
        "When you create a Google Account, you provide us with personal information that includes your name and a password. You can also choose to add a phone number or payment information to your account. Even if you aren’t signed in to a Google Account, you might choose to provide us with information — like an email address to communicate with Google or receive updates about our services.",
    },
  ];
  return loading ? (
    <Loader />
  ) : (
    <div className="mt-10">
      <div>
        <p className="text-center font-medium text-3xl my-10">Privacy Policy</p>
      </div>
      {/* policies list and disclaimer */}
      <div className="flex justify-center gap-10 flex-wrap">
        {/* list */}
        <div style={{ boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px" }}>
          <h1 className="px-14 py-2 font-semibold text-lg text-center">
            Policies
          </h1>
          {policies.map((item, index) => (
            <div key={index}>
              <a href={`#${item?.title}`}>
                <p className="px-14 py-1 my-2  hover:bg-[#EDF6FB]">
                  {item.title}
                </p>
              </a>
            </div>
          ))}
        </div>

        {/* disclaimer */}
        <div
          className="md:w-[70%] p-10"
          style={{ boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px" }}
        >
          {policies.map((item, index) => (
            <div id={`${item.title}`} key={index}>
              <h1 className="text-2xl">{item.title}</h1>
              <p className="my-4">{item.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
