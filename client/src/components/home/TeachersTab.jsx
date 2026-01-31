// src/components/home/TeachersTab.jsx
import React, { useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";

const TeachersTab = () => {
  const { theme } = useTheme();
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [showTeacherModal, setShowTeacherModal] = useState(false);

  // Teacher data with AI-generated image URLs
  const teachers = [
    {
      id: 1,
      name: "Dr. Sarah Johnson",
      title: "Professor of Computer Science",
      department: "Computer Science",
      specialty: "Artificial Intelligence & Machine Learning",
      email: "sarah.johnson@university.edu",
      phone: "+1 (555) 123-4567",
      whatsapp: "+15551234567",
      office: "Room 302, CS Building",
      description:
        "Specialized in AI research with 15+ years of teaching experience. Published over 50 research papers in top-tier conferences.",
      image:
        "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop&crop=face",
      rating: 4.8,
      courses: [
        "CS301 - AI Fundamentals",
        "CS501 - Machine Learning",
        "CS601 - Deep Learning",
      ],
    },
    {
      id: 2,
      name: "Prof. Michael Chen",
      title: "Associate Professor",
      department: "Business Administration",
      specialty: "Finance & Investment",
      email: "michael.chen@university.edu",
      phone: "+1 (555) 234-5678",
      whatsapp: "+15552345678",
      office: "Room 105, Business School",
      description:
        "Former investment banker with expertise in corporate finance and portfolio management. Passionate about practical business applications.",
      image:
        "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop&crop=face",
      rating: 4.7,
      courses: [
        "BBA201 - Financial Accounting",
        "BBA401 - Investment Analysis",
        "BBA501 - Corporate Finance",
      ],
    },
    {
      id: 3,
      name: "Dr. Emily Rodriguez",
      title: "Senior Lecturer",
      department: "Mathematics",
      specialty: "Applied Mathematics & Statistics",
      email: "emily.rodriguez@university.edu",
      phone: "+1 (555) 345-6789",
      whatsapp: "+15553456789",
      office: "Room 208, Math Building",
      description:
        "Focuses on making complex mathematical concepts accessible. Awarded 'Teacher of the Year' 3 times.",
      image:
        "https://images.unsplash.com/photo-1494790108755-2616b786d4d9?w=400&h=400&fit=crop&crop=face",
      rating: 4.9,
      courses: [
        "MATH101 - Calculus I",
        "MATH301 - Statistics",
        "MATH401 - Linear Algebra",
      ],
    },
    {
      id: 4,
      name: "Prof. James Wilson",
      title: "Assistant Professor",
      department: "Electrical Engineering",
      specialty: "Embedded Systems & IoT",
      email: "james.wilson@university.edu",
      phone: "+1 (555) 456-7890",
      whatsapp: "+15554567890",
      office: "Room 410, Engineering Building",
      description:
        "Industry experience in IoT systems design. Leads university's Robotics Club.",
      image:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
      rating: 4.6,
      courses: [
        "EE201 - Circuit Theory",
        "EE401 - Embedded Systems",
        "EE501 - IoT Architecture",
      ],
    },
    {
      id: 5,
      name: "Dr. Lisa Anderson",
      title: "Professor",
      department: "Psychology",
      specialty: "Cognitive Psychology",
      email: "lisa.anderson@university.edu",
      phone: "+1 (555) 567-8901",
      whatsapp: "+15555678901",
      office: "Room 115, Psychology Building",
      description:
        "Research focuses on learning behaviors and cognitive development. Author of 3 textbooks.",
      image:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&crop=face",
      rating: 4.8,
      courses: [
        "PSY101 - Introduction to Psychology",
        "PSY301 - Cognitive Psychology",
        "PSY501 - Research Methods",
      ],
    },
    {
      id: 6,
      name: "Prof. David Kim",
      title: "Lecturer",
      department: "English Literature",
      specialty: "Modern American Literature",
      email: "david.kim@university.edu",
      phone: "+1 (555) 678-9012",
      whatsapp: "+15556789012",
      office: "Room 303, Humanities Building",
      description:
        "Passionate about contemporary literature and creative writing. Runs the University Writing Center.",
      image:
        "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop&crop=face",
      rating: 4.7,
      courses: [
        "ENG101 - Composition",
        "ENG301 - American Literature",
        "ENG401 - Creative Writing",
      ],
    },
  ];

  const handleTeacherClick = (teacher) => {
    setSelectedTeacher(teacher);
    setShowTeacherModal(true);
  };

  const handleWhatsAppClick = (phone) => {
    const message = `Hello! I'm a student from EduConnect. I'd like to connect with you regarding academic guidance.`;
    const whatsappUrl = `https://wa.me/${phone.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  const handleEmailClick = (email) => {
    const subject = "Academic Inquiry - EduConnect Student";
    const body = `Dear Professor,\n\nI hope this message finds you well. I'm a student from EduConnect and I would like to discuss...\n\nBest regards,\n[Your Name]`;
    const mailtoUrl = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoUrl, "_blank");
  };

  const TeacherCard = ({ teacher }) => (
    <motion.div
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => handleTeacherClick(teacher)}
      className={`w-full mb-4 cursor-pointer rounded-2xl p-4 transition-all duration-200 ${
        theme === "light"
          ? "bg-white border border-gray-200 hover:border-blue-300 hover:shadow-lg"
          : "bg-gray-800 border border-gray-700 hover:border-blue-500 hover:shadow-lg"
      }`}
    >
      <div className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-4">
        {/* Teacher Image */}
        <div className="flex-shrink-0 w-full sm:w-24 h-48 sm:h-24 relative">
          <img
            src={teacher.image}
            alt={teacher.name}
            className="w-full h-full object-cover rounded-xl"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(teacher.name)}&background=3b82f6&color=fff&size=200`;
            }}
          />
          <div className="absolute top-2 right-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-xs px-2 py-1 rounded-full">
            ⭐ {teacher.rating}
          </div>
        </div>

        {/* Teacher Info */}
        <div className="flex-1 min-w-0">
          <div>
            <h3 className="font-bold text-lg mb-1">{teacher.name}</h3>
            <p
              className={`text-sm mb-2 ${theme === "light" ? "text-blue-600" : "text-blue-400"}`}
            >
              {teacher.title}
            </p>
          </div>

          <div className="space-y-2 mt-2">
            {/* Department */}
            <div className="flex items-center">
              <svg
                className="w-4 h-4 mr-2 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
              <span className="text-sm font-medium">{teacher.department}</span>
            </div>

            {/* Specialty */}
            <div className="flex items-center">
              <svg
                className="w-4 h-4 mr-2 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
              <span className="text-sm">{teacher.specialty}</span>
            </div>

            {/* Courses Count */}
            <div className="flex items-center">
              <svg
                className="w-4 h-4 mr-2 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
              <span className="text-sm">{teacher.courses.length} courses</span>
            </div>
          </div>

          {/* Contact Buttons - Only on mobile */}
          <div className="flex space-x-2 mt-3 sm:hidden">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleWhatsAppClick(teacher.whatsapp);
              }}
              className="flex-1 bg-green-500 text-white text-xs py-2 rounded-lg flex items-center justify-center space-x-1"
            >
              <span>WhatsApp</span>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleEmailClick(teacher.email);
              }}
              className="flex-1 bg-blue-500 text-white text-xs py-2 rounded-lg flex items-center justify-center space-x-1"
            >
              <span>Email</span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );

  // Teacher Details Modal
  const TeacherModal = () => {
    if (!selectedTeacher) return null;

    return (
      <AnimatePresence>
        {showTeacherModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowTeacherModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className={`rounded-2xl w-full max-w-md md:max-w-2xl max-h-[85vh] overflow-y-auto mb-30 ${
                theme === "light" ? "bg-white" : "bg-gray-800"
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div
                className={`p-6 border-b ${theme === "light" ? "border-gray-200" : "border-gray-700"}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="relative w-20 h-20">
                      <img
                        src={selectedTeacher.image}
                        alt={selectedTeacher.name}
                        className="w-full h-full object-cover rounded-full"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedTeacher.name)}&background=3b82f6&color=fff&size=200`;
                        }}
                      />
                      <div className="absolute -bottom-1 -right-1 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-xs px-2 py-1 rounded-full">
                        ⭐ {selectedTeacher.rating}
                      </div>
                    </div>
                    <div>
                      <h2 className="text-xl font-bold">
                        {selectedTeacher.name}
                      </h2>
                      <p
                        className={`text-sm ${theme === "light" ? "text-blue-600" : "text-blue-400"}`}
                      >
                        {selectedTeacher.title}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowTeacherModal(false)}
                    className={`p-2 rounded-lg ${theme === "light" ? "hover:bg-gray-100" : "hover:bg-gray-700"}`}
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6">
                <div className="space-y-6">
                  {/* Department & Specialty */}
                  <div className="flex flex-wrap gap-2">
                    <div
                      className={`px-3 py-1 rounded-lg ${theme === "light" ? "bg-blue-50 text-blue-700" : "bg-blue-900/30 text-blue-300"}`}
                    >
                      {selectedTeacher.department}
                    </div>
                    <div
                      className={`px-3 py-1 rounded-lg ${theme === "light" ? "bg-indigo-50 text-indigo-700" : "bg-indigo-900/30 text-indigo-300"}`}
                    >
                      {selectedTeacher.specialty}
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <h3 className="text-lg font-bold mb-2">About</h3>
                    <p
                      className={`leading-relaxed ${theme === "light" ? "text-gray-700" : "text-gray-300"}`}
                    >
                      {selectedTeacher.description}
                    </p>
                  </div>

                  {/* Contact Information */}
                  <div>
                    <h3 className="text-lg font-bold mb-3">
                      Contact Information
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <div
                          className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 ${theme === "light" ? "bg-blue-100" : "bg-blue-900/30"}`}
                        >
                          <svg
                            className="w-5 h-5 text-blue-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Email</p>
                          <p className="font-medium">{selectedTeacher.email}</p>
                        </div>
                      </div>

                      <div className="flex items-center">
                        <div
                          className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 ${theme === "light" ? "bg-blue-100" : "bg-blue-900/30"}`}
                        >
                          <svg
                            className="w-5 h-5 text-blue-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                            />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Phone</p>
                          <p className="font-medium">{selectedTeacher.phone}</p>
                        </div>
                      </div>

                      <div className="flex items-center">
                        <div
                          className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 ${theme === "light" ? "bg-blue-100" : "bg-blue-900/30"}`}
                        >
                          <svg
                            className="w-5 h-5 text-blue-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                            />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Office</p>
                          <p className="font-medium">
                            {selectedTeacher.office}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Courses */}
                  <div>
                    <h3 className="text-lg font-bold mb-3">Courses Taught</h3>
                    <div className="space-y-2">
                      {selectedTeacher.courses.map((course, index) => (
                        <div
                          key={index}
                          className={`flex items-center p-3 rounded-lg ${theme === "light" ? "bg-gray-50" : "bg-gray-700"}`}
                        >
                          <svg
                            className="w-5 h-5 mr-3 text-blue-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                            />
                          </svg>
                          <span className="font-medium">{course}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 pt-4">
                    <button
                      onClick={() =>
                        handleWhatsAppClick(selectedTeacher.whatsapp)
                      }
                      className="flex-1 py-3 rounded-xl font-medium bg-green-500 text-white hover:bg-green-600 transition-all flex items-center justify-center space-x-2"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.76.982.998-3.675-.236-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.9 6.994c-.004 5.45-4.438 9.88-9.888 9.88m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.333.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.333 11.893-11.893 0-3.18-1.24-6.162-3.495-8.411" />
                      </svg>
                      <span>Message on WhatsApp</span>
                    </button>
                    <button
                      onClick={() => handleEmailClick(selectedTeacher.email)}
                      className="flex-1 py-3 rounded-xl font-medium border border-blue-500 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20 transition-all flex items-center justify-center space-x-2"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                      <span>Send Email</span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  };

  return (
    <div className="p-4 md:p-8 pb-24 md:pb-8">
      {" "}
      {/* Added padding-bottom for mobile nav */}
      <TeacherModal />
      <div className="text-center mb-8">
        <div className="w-20 h-20 md:w-24 md:h-24 mx-auto mb-4 md:mb-6 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
          <span className="text-3xl md:text-4xl">👨‍🏫</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold mb-4">
          University Faculty
        </h2>
        <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto text-sm md:text-base">
          Connect with our experienced faculty members. Click on any teacher to
          view details and contact them directly.
        </p>
      </div>
      {/* Teachers Grid - 1 column on mobile, 2 on medium screens */}
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {teachers.map((teacher) => (
            <TeacherCard key={teacher.id} teacher={teacher} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeachersTab;
