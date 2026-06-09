interface TodaySurveyProps {
  title: string;
  rewardAmount: number;
  estMinutes: string;
  url: string;
  participated: boolean;
}

const TodaySurvey = ({ title, rewardAmount, estMinutes, url, participated }: TodaySurveyProps) => {
  return (
    <section>
      <p>오늘 설문</p>
      <h2 className='label-medium'>{title}</h2>
    </section>
  );
};

export default TodaySurvey;
