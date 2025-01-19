import React from "react";
import { CreditCard, Smartphone, Wallet } from "lucide-react";
import { Account } from "../../types";

interface AccountCardProps {
  account: Account;
}

const AccountCard: React.FC<AccountCardProps> = ({ account }) => {
  const getIcon = () => {
    switch (account.type) {
      case "BANK":
        return <CreditCard className="w-8 h-8 text-blue-600" />;
      case "MOBILE":
        return <Smartphone className="w-8 h-8 text-green-600" />;
      case "CASH":
        return <Wallet className="w-8 h-8 text-yellow-600" />;
    }
  };

  const getGradient = () => {
    switch (account.type) {
      case "BANK":
        return "from-blue-50 to-white";
      case "MOBILE":
        return "from-green-50 to-white";
      case "CASH":
        return "from-yellow-50 to-white";
    }
  };

  return (
    <div
      className={`bg-gradient-to-br ${getGradient()} p-6 rounded-xl shadow-sm`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          {getIcon()}
          <h3 className="font-semibold text-lg">{account.name}</h3>
        </div>
        <span className="text-xs font-medium px-2 py-1 bg-white rounded-full">
          {account.type}
        </span>
      </div>
      <div className="mt-4">
        <p className="text-sm text-gray-500">Current Balance</p>
        <p className="text-2xl font-bold">
          ${account.balance.toLocaleString()}
        </p>
      </div>
    </div>
  );
};

export default AccountCard;
