import { useState } from "react";
import {
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { BackButton } from "../components/BackButton";
import { Checkbox } from "../components/Checkbox";
import { Feather } from "@expo/vector-icons";
import colors from "tailwindcss/colors";
import { api } from "../lib/axios";

const availableWeekDays = [
  "Domingo",
  "Segunda",
  "Terça",
  "Quarta",
  "Quinta",
  "Sexta",
  "Sábado",
];

export function New() {
  const [weekDays, setWeekDays] = useState<number[]>([]);
  const [title, setTitle] = useState("");
  function handleToggleWeekDay(weekDay: number) {
    const alreadySelected = weekDays.includes(weekDay);

    if (alreadySelected) {
      const filteredWeekDays = weekDays.filter((day) => day !== weekDay);
      setWeekDays(filteredWeekDays);
    } else {
      setWeekDays((oldWeekDays) => [...oldWeekDays, weekDay]);
    }
  }

  async function handleCreateNewHabit() {
    try {
      if (!title.trim() || !weekDays.length) {
        return Alert.alert("Novo Hábito", "Informe o hábito e a periodicidade");
      }

      await api.post("/habits", {
        title,
        weekDays,
      });

      setTitle("");
      setWeekDays([]);
      Alert.alert("Novo Hábito", "Hábito criado com sucesso");
    } catch (e) {
      console.log(JSON.stringify(e));
      Alert.alert("Ops", "Não foi possível criar o hábito");
    }
  }

  return (
    <View className="flex-1 bg-background px-8 pt-16">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 80,
        }}
      >
        <BackButton />
        <Text className="mt-6 text-white font-extrabold text-3xl">
          Criar hábito
        </Text>

        <Text className="mt-6 text-white font-semi-bold text-base">
          Qual o seu comprometimento?
        </Text>

        <TextInput
          placeholder="Ex.: Dormir bem"
          placeholderTextColor={colors.zinc[400]}
          className="h-12 pl-4 rounded-lg mt-3 bg-zinc-900 text-white border-2 border-zinc-800 focus:border-green-600"
          onChangeText={setTitle}
          value={title}
        />

        <Text className="mt-6 mb-6 text-white font-semi-bold text-base">
          Qual a recorrência?
        </Text>
        {availableWeekDays.map((day, index) => (
          <Checkbox
            checked={weekDays.includes(index)}
            title={day}
            key={day}
            onPress={() => handleToggleWeekDay(index)}
          />
        ))}

        <TouchableOpacity
          className="w-full h-14 flex-row items-center justify-center bg-green-600 rounded-md mt-6"
          activeOpacity={0.7}
          onPress={handleCreateNewHabit}
        >
          <Feather name="check" size={20} color={colors.white} />
          <Text className="font-semibold text-base text-white ml-2">
            Confirmar
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
