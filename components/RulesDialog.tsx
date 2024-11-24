import React, { useEffect } from 'react';
import { HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";

const RulesDialog = () => {
  const rules = [
    "Each day brings a new pun puzzle",
    "See a question, guess the pun-chline",
    "Spaces show word breaks in the answer",
    "You get 5 attempts to solve each pun",
    "Correct letters in guesses fill in the blanks",
    "Puns are worth 1-3 points (Easy/Medium/Hard)",
    "Build your score and level with correct answers",
    "Missing all 5 attempts resets score & level to 0",
    "Having pun?! Share Punderous™ with a friend or five!"
  ];

  const [open, setOpen] = React.useState(false);

  useEffect(() => {
    if (open) {
      const handleKeyPress = (event: KeyboardEvent) => {
        if (event.key === 'Enter' && window.innerWidth >= 768) {
          setOpen(false);
        }
      };

      window.addEventListener('keypress', handleKeyPress);
      return () => {
        window.removeEventListener('keypress', handleKeyPress);
      };
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
  <Button 
    className="flex-1 bg-[#A06CD5] text-white hover:bg-[#A06CD5]/90 text-[13px] py-1 h-9"
  >
    <HelpCircle className="w-3 h-3 mr-1" />
    How to Play
  </Button>
</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center mb-4">
            How to Play Punderous™
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-3 mb-6">
          {rules.map((rule, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start gap-2"
            >
              <span className="text-[#00B4D8] font-bold">•</span>
              <p className="text-sm text-gray-700">{rule}</p>
            </motion.div>
          ))}
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: rules.length * 0.1 }}
          className="flex justify-center"
        >
          <DialogClose asChild>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-2 rounded-lg bg-[#00B4D8] text-white font-medium hover:bg-opacity-90 transition-colors"
            >
              Back to Game
            </motion.button>
          </DialogClose>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default RulesDialog;