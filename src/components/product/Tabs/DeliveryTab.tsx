import { motion } from "framer-motion";
import { Truck, Clock, Calendar } from "lucide-react";

export default function DeliveryTab() {
  return (
    <motion.div
      key="delivery"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="bg-background rounded-2xl p-8 shadow-sm">
        <h3 className="font-cormorant text-2xl font-bold text-foreground  mb-6">
          Delivery Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-muted rounded-xl">
            <Truck className="w-8 h-8 text-primary mx-auto mb-3" />
            <h4 className="font-semibold text-foreground mb-2">
              Standard Delivery
            </h4>
            <p className="text-sm text-muted-foreground mb-2">
              Next day across UAE
            </p>
            <p className="text-sm font-medium text-primary">
              Free over AED 500
            </p>
          </div>
          <div className="text-center p-6 bg-muted rounded-xl">
            <Clock className="w-8 h-8 text-primary mx-auto mb-3" />
            <h4 className="font-semibold text-foreground mb-2">
              Same Day Delivery
            </h4>
            <p className="text-sm text-muted-foreground mb-2">
              Fresh flowers today in Dubai
            </p>
            <p className="text-sm font-medium text-primary">AED 50</p>
          </div>
          <div className="text-center p-6 bg-muted rounded-xl">
            <Calendar className="w-8 h-8 text-primary mx-auto mb-3" />
            <h4 className="font-semibold text-foreground mb-2">
              Scheduled Delivery
            </h4>
            <p className="text-sm text-muted-foreground mb-2">
              Perfect for special occasions
            </p>
            <p className="text-sm font-medium text-primary">AED 25</p>
          </div>
        </div>
        <div className="mt-6 p-4 bg-green-50 dark:bg-green-950/40 rounded-lg border border-green-200 dark:border-green-800">
          <p className="text-sm text-green-800 dark:text-green-300">
            <strong>Freshness Guarantee:</strong> All flowers are sourced fresh
            daily and arranged by our expert florists. We guarantee the
            freshness and quality of every arrangement delivered.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
