const messages = {
  en: {
    messages: {
      inn: 'Wrong INN',
      bik: 'BIC code (MFO) contains 9 digits',
      kpp: 'IEC code (recipient code) consists of 9 digits',
      ogrn: 'Wrong PSRN for Legal',
      ogrnIp: 'Wrong PSRNSP for Individual',
      correspondentAccount: 'Wrong correspondent account or BIC',
      personalAccount: 'Wrong beneficiary`s account or BIC',
      sessionEndDate: 'End session date can`t be more then start session date',
      sessionEndTime: 'End session date can`t be less then 15:00',
      sessionEndTimeWithProlongation: 'End session date with prolongation can`t be less then 15:00',
      sessionStartTime: 'Start session date can`t be less then 11:00',
      sessionStartTimeMax: 'Start session date can`t be more then 14:00',
      sessionDuration: 'Session duration can`t be less then 10 minutes',
      lotWarrantyEquals: 'Warranty for organizer and warranty for request are not equals'
    }
  },
  ru: {
    messages: {
      inn: 'Недопустимый ИНН',
      bik: 'БИК может состоять только из 9 цифр',
      kpp: 'КПП может состоять только из 9 знаков',
      ogrn: 'Недопустимый ОГРН для ЮЛ',
      ogrnIp: 'Недопустимый ОГРН для ИП',
      personalAccount: 'Неправильный расчетный счет или БИК',
      correspondentAccount: 'Неправильный корреспондентский счет или БИК',
      sessionEndDate: 'Дата завершения сессии не может быть меньше даты начала',
      sessionEndTime: 'Время завершения сессии не может быть больше 15:00 по МСК.',
      sessionEndTimeWithProlongation: 'Время завершения продленной сессии не может быть больше 15:00 по МСК.',
      sessionStartTime: 'Время начала сессии не может быть меньше 11:00 по МСК',
      sessionStartTimeMax: 'Время начала сессии не может быть позднее 14:00 по МСК',
      sessionDuration: 'Длительность сессии не может быть меньше 10 минут',
      lotWarrantyEquals: 'Гарантийное обеспечение организатора и участника не совпадают'
    }
  }
}

export default messages
