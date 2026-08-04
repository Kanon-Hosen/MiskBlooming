import { Product } from "@/src/types";
import { motion } from "framer-motion";
import { Leaf } from "lucide-react";

interface CareTabProps {
  product: Product;
}

export default function CareTab({ product }: CareTabProps) {
  return (
    <motion.div
      key="care"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="bg-background rounded-2xl p-8 shadow-sm">
        <h3 className="font-cormorant text-2xl font-bold text-foreground  mb-6">
          Care Instructions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h4 className="font-semibold text-foreground  mb-4 flex items-center">
              <Leaf className="w-5 h-5 text-green-500 mr-2" />
              Daily Care
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start">
                <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span className="text-muted-foreground">
                  {product.careInstructions}
                </span>
              </li>
            </ul>
          </div>
          <div className="bg-muted rounded-xl p-6">
            <h4 className="font-semibold text-foreground  mb-4">Pro Tips</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>• Use lukewarm water for best results</li>
              <li>• Trim stems every 2-3 days</li>
              <li>• Keep away from direct heat sources</li>
              <li>• Remove wilted flowers promptly</li>
            </ul>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
